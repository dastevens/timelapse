using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace engine
{
    public class Queue
    {
        private readonly static Logger Logger = LogManager.GetCurrentClassLogger();

        private const string projectFileExtension = "tlp";
        private readonly TimeSpan checkPeriod = TimeSpan.FromSeconds(10);
        private readonly IFileSystem fileSystem;
        private readonly string path;
        private readonly JsonSerializer serializer = new JsonSerializer();

        public Queue(IFileSystem fileSystem, string path)
        {
            this.fileSystem = fileSystem;
            this.path = path;
        }

        public Task PushAsync(Project project)
        {
            return Task.Run(() =>
            {
                var projectFile = ProjectFile(project.ProjectId);
                using (var streamWriter = fileSystem.File.CreateText(projectFile))
                {
                    Logger.Info($"Adding project file {projectFile}");
                    serializer.Serialize(streamWriter, project);
                }
            });
        }

        private string ProjectFile(ProjectId projectId)
        {
            return fileSystem.Path.Combine(path, $"{projectId.Name}.{projectFileExtension}");
        }

        public Task<IEnumerable<Project>> ReadQueueAsync()
        {
            return Task<IEnumerable<Project>>.Run(() =>
            {
                var projectFiles = fileSystem.DirectoryInfo.FromDirectoryName(path)
                    .EnumerateFiles($"*.{projectFileExtension}");
                return projectFiles
                    .Select(projectFile =>
                    {
                        using (var streamReader = projectFile.OpenText())
                        {
                            return (Project)serializer.Deserialize(streamReader, typeof(Project));
                        }
                    });
            });
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
                    .Where(project => project.Start.Add(checkPeriod) < DateTime.Now)
                    .Take(1);
                if (front.Any())
                {
                    var project = front.First();
                    Logger.Info($"Popping project {project.ProjectId.Name}");
                    await RemoveAsync(front.First().ProjectId);
                    return front.First();
                }
                else
                {
                    await Task.Delay(checkPeriod, cancellationToken);
                }
            }
            return await Task.FromCanceled<Project>(cancellationToken);
        }
    }
}
