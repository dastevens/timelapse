using NLog;
using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace engine
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
            fileSystem.Directory.CreateDirectory(projectFolder);
            for (var i = 0; (i < project.Images) && !cancellationToken.IsCancellationRequested; i++)
            {
                var imageName = fileSystem.Path.Combine(projectFolder, $"{i:D4}.jpg");
                Logger.Info(imageName);
                await camera.Capture(imageName);
                await Task.Delay(project.Interval, cancellationToken);
            }
        }
    }
}
