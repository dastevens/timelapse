using NLog;
using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace core
{
    public class Job
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly IFileSystem fileSystem;
        private readonly string jobFolder;
        private readonly Project project;
        private readonly Signal abortSignal;

        public Job(IFileSystem fileSystem, string jobFolder, Project project)
        {
            this.fileSystem = fileSystem;
            this.jobFolder = jobFolder;
            this.project = project;
            this.abortSignal = new Signal(fileSystem, fileSystem.Path.Combine(jobFolder, "abort.command"));
        }

        public Task StartAsync(ICamera camera, CancellationToken cancellationToken)
        {
            var jobCompletion = new CancellationTokenSource();
            return Task.WhenAll(
                Task.Run(() =>
                {
                    RunJobAsync(camera, cancellationToken).Wait();
                    jobCompletion.Cancel();
                }),
                abortSignal.WaitSignalAsync(jobCompletion.Token));
        }

        public async Task RunJobAsync(ICamera camera, CancellationToken cancellationToken)
        {
            Logger.Info($"Job {project.ProjectId.Name} started");
            fileSystem.Directory.CreateDirectory(jobFolder);
            var projectFile = fileSystem.Path.Combine(jobFolder, $"{project.ProjectId.Name}.json");
            await JsonHelper.SaveAs(fileSystem, project, projectFile);
            var nextCapture = project.Start;
            for (var i = 0; (i < project.Images) && !cancellationToken.IsCancellationRequested; i++)
            {
                var delay = nextCapture.Subtract(DateTime.UtcNow);
                var imageName = fileSystem.Path.Combine(jobFolder, $"{i:D4}.jpg");
                if (delay > TimeSpan.Zero)
                {
                    await Task.Delay(delay, cancellationToken);
                    Logger.Info(imageName);
                    await camera.Capture(imageName);
                    await WriteJobStatusAsync(projectFile, nextCapture.Add(project.Interval), i);
                }
                else
                {
                    Logger.Warn($"Missed {imageName} at {nextCapture.ToString("o")}");
                }
                nextCapture = nextCapture.Add(project.Interval);
            }
        }

        private async Task WriteJobStatusAsync(string projectFile, DateTime nextCapture, int imageNumber)
        {
            await JsonHelper.SaveAs(fileSystem, new JobStatus(projectFile, nextCapture, imageNumber), JobStatusFileName(fileSystem, jobFolder));
        }

        public static async Task<JobStatus> ReadJobStatusAsync(IFileSystem fileSystem, string jobFolder)
        {
            var jobStatusFileName = JobStatusFileName(fileSystem, jobFolder);
            if (fileSystem.File.Exists(jobStatusFileName))
            {
                return await JsonHelper.ReadFrom<JobStatus>(fileSystem, JobStatusFileName(fileSystem, jobFolder));
            }
            else
            {
                return new JobStatus(null, DateTime.MaxValue, 0);
            }
        }

        private static string JobStatusFileName(IFileSystem fileSystem, string jobFolder)
        {
            return fileSystem.Path.Combine(jobFolder, "status.info");
        }

        public static async Task SendAbortSignalAsync(IFileSystem fileSystem, string jobFolder)
        {
            await new Signal(fileSystem, fileSystem.Path.Combine(jobFolder, "abort.command")).RaiseAsync();
        }
    }
}
