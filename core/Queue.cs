using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace core
{
    public class Queue
    {
        private readonly static Logger Logger = LogManager.GetCurrentClassLogger();

        private const string projectFileExtension = "json";
        private readonly TimeSpan checkPeriod = TimeSpan.FromSeconds(10);
        private readonly IFileSystem fileSystem;
        private readonly string path;

        public Queue(IFileSystem fileSystem, string path)
        {
            this.fileSystem = fileSystem;
            this.path = path;
        }

        public async Task PushAsync(Project project)
        {
            var projectFile = ProjectFile(project.ProjectId);
            Logger.Info($"Adding project file {projectFile}");
            await JsonHelper.SaveAs(fileSystem, project, projectFile);
        }

        private string ProjectFile(ProjectId projectId)
        {
            return fileSystem.Path.Combine(path, $"{projectId.Name}.{projectFileExtension}");
        }

        public async Task<IEnumerable<Project>> ReadQueueAsync()
        {
            var projectFiles = fileSystem.DirectoryInfo.FromDirectoryName(path)
                .EnumerateFiles($"*.{projectFileExtension}");
            var projects = new List<Project>();
            foreach (var projectFile in projectFiles)
            {
                projects.Add(await JsonHelper.ReadFrom<Project>(fileSystem, projectFile.FullName));
            }
            return projects;
        }

        public Task RemoveAsync(ProjectId projectId)
        {
            return Task.Run(() =>
            {
                var projectFile = ProjectFile(projectId);
                Logger.Info($"Removing project file {projectFile}");
                if (fileSystem.File.Exists(projectFile))
                {
                    fileSystem.File.Delete(ProjectFile(projectId));
                }
            });
        }

        public async Task<Project> PopAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                var front = (await ReadQueueAsync())
                    .ToArray()
                    .OrderBy(project => project.Start)
                    .Take(1);
                if (front.Any())
                {
                    var next = front.First();
                    if (next.Start < DateTime.UtcNow.Add(checkPeriod).Add(checkPeriod))
                    {
                        Logger.Info($"Popping project {next.ProjectId.Name}");
                        await RemoveAsync(next.ProjectId);
                        return next;
                    }
                    else
                    {
                        Logger.Info($"Next project {next.ProjectId.Name} starts in {next.Start.Subtract(DateTime.UtcNow)}");
                    }
                }
                else
                {
                    Logger.Info($"No projects in queue");
                }
                await Task.Delay(checkPeriod, cancellationToken);
            }
            return await Task.FromCanceled<Project>(cancellationToken);
        }
    }
}
