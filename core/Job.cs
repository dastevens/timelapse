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
        private readonly string projectFolder;
        private readonly Project project;

        public Job(IFileSystem fileSystem, string projectFolder, Project project)
        {
            this.fileSystem = fileSystem;
            this.projectFolder = projectFolder;
            this.project = project;
        }

        public async Task StartAsync(ICamera camera, CancellationToken cancellationToken)
        {
            Logger.Info($"Job {project.ProjectId.Name} started");
            fileSystem.Directory.CreateDirectory(projectFolder);
            var projectFile = fileSystem.Path.Combine(projectFolder, $"{project.ProjectId.Name}.json");
            await Project.SaveAs(fileSystem, project, projectFile);
            var nextCapture = project.Start;
            for (var i = 0; (i < project.Images) && !cancellationToken.IsCancellationRequested; i++)
            {
                var delay = nextCapture.Subtract(DateTime.Now);
                var imageName = fileSystem.Path.Combine(projectFolder, $"{i:D4}.jpg");
                if (delay > TimeSpan.Zero)
                {
                    await Task.Delay(delay, cancellationToken);
                    Logger.Info(imageName);
                    await camera.Capture(imageName);
                }
                else
                {
                    Logger.Warn($"Missed {imageName} at {nextCapture.ToString("o")}");
                }
                nextCapture = nextCapture.Add(project.Interval);
            }
        }
    }
}
