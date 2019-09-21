using NLog;
using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace core
{
    public class Engine
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly Config config;
        private readonly ICameraFactory cameraFactory;
        private readonly IFileSystem fileSystem;

        public Engine(Config config, ICameraFactory cameraFactory, IFileSystem fileSystem)
        {
            this.config = config;
            this.cameraFactory = cameraFactory;
            this.fileSystem = fileSystem;
        }

        public async Task RunAsync(CancellationToken cancellationToken)
        {
            Logger.Info("Creating queue");
            var queueFolder = fileSystem.Path.GetFullPath(config.QueueFolder);
            fileSystem.Directory.CreateDirectory(queueFolder);
            var queue = new Queue(fileSystem, queueFolder);
            var engineFolder = fileSystem.Path.GetFullPath(config.EngineFolder);
            fileSystem.Directory.CreateDirectory(engineFolder);
            var jobFolder = fileSystem.Path.GetFullPath(config.JobFolder);
            fileSystem.Directory.CreateDirectory(jobFolder);
            var projectsFolder = fileSystem.Path.GetFullPath(config.ProjectsFolder);
            fileSystem.Directory.CreateDirectory(projectsFolder);
            var scheduler = new Scheduler(fileSystem, engineFolder, jobFolder, projectsFolder, queue, cameraFactory);
            Logger.Info("Starting scheduler");
            await scheduler.StartAsync(cancellationToken);
        }

        public static async Task SendPreviewSignalAsync(IFileSystem fileSystem, string engineFolder)
        {
            await new Signal(fileSystem, fileSystem.Path.Combine(engineFolder, "preview")).RaiseAsync();
        }
    }
}
