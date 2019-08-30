using NLog;
using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace engine
{
    public class Scheduler
    {
        private Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly IFileSystem fileSystem;
        private readonly string jobFolder;
        private readonly Queue queue;
        private readonly CameraProvider cameraProvider;

        public Scheduler(IFileSystem fileSystem, string jobFolder, Queue queue, CameraProvider cameraProvider)
        {
            this.fileSystem = fileSystem;
            this.jobFolder = jobFolder;
            this.queue = queue;
            this.cameraProvider = cameraProvider;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            await Task.Run(() => fileSystem.Directory.CreateDirectory(jobFolder));
            while (!cancellationToken.IsCancellationRequested)
            {
                await Sweep(cancellationToken);
            }
        }

        private async Task Sweep(CancellationToken cancellationToken)
        {
            var project = await queue.PopAsync(cancellationToken);
            var projectFolder = fileSystem.Path.Combine(jobFolder, project.ProjectId.Name);
            var job = new Job(fileSystem, projectFolder, project);
            Logger.Info($"Starting job {project.ProjectId.Name}");
            using (var camera = cameraProvider.Create())
            {
                await job.StartAsync(camera, cancellationToken);
                Logger.Info($"Completed job {project.ProjectId.Name}");
            }
        }
    }
}
