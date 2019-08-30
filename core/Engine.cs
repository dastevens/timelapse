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
        private readonly ICameraFactory cameraFactory;
        private readonly IFileSystem fileSystem;

        public Engine(ICameraFactory cameraFactory, IFileSystem fileSystem)
        {
            this.cameraFactory = cameraFactory;
            this.fileSystem = fileSystem;
        }

        public async Task RunAsync(CancellationToken cancellationToken)
        {
            Logger.Info("Creating queue");
            var queueFolder = fileSystem.Path.GetFullPath("queue");
            fileSystem.Directory.CreateDirectory(queueFolder);
            var queue = new Queue(fileSystem, queueFolder);
            var jobFolder = fileSystem.Path.GetFullPath("projects");
            var scheduler = new Scheduler(fileSystem, jobFolder, queue, cameraFactory);
            Logger.Info("Starting scheduler");
            await scheduler.StartAsync(cancellationToken);
        }
    }
}
