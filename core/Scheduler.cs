using NLog;
using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace core
{
    public class Scheduler
    {
        private Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly IFileSystem fileSystem;
        private readonly string engineFolder;
        private readonly string jobFolder;
        private readonly string projectsFolder;
        private readonly Queue queue;
        private readonly ICameraFactory cameraFactory;
        private readonly Signal heartbeatSignal;
        private readonly Signal requestPreviewSignal;
        private readonly Signal previewCompleteSignal;
        private bool acquisition = false;

        public Scheduler(IFileSystem fileSystem, string engineFolder, string jobFolder, string projectsFolder, Queue queue, ICameraFactory cameraFactory)
        {
            this.fileSystem = fileSystem;
            this.engineFolder = engineFolder;
            this.jobFolder = jobFolder;
            this.projectsFolder = projectsFolder;
            this.queue = queue;
            this.cameraFactory = cameraFactory;
            this.heartbeatSignal = new Signal(fileSystem, fileSystem.Path.Combine(engineFolder, "heartbeat"));
            this.requestPreviewSignal = new Signal(fileSystem, fileSystem.Path.Combine(engineFolder, "request-preview"));
            this.previewCompleteSignal = new Signal(fileSystem, fileSystem.Path.Combine(engineFolder, "preview-complete"));
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            var schedulerCompletion = new CancellationTokenSource();
            _ = HeartbeatAsync(schedulerCompletion.Token);
            _ = PreviewAsync(schedulerCompletion.Token);
            while (!cancellationToken.IsCancellationRequested)
            {
                await Sweep(cancellationToken);
            }
            schedulerCompletion.Cancel();
        }
        private async Task HeartbeatAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                await heartbeatSignal.RaiseAsync();
                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }

        private async Task PreviewAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                await requestPreviewSignal.WaitSignalAsync(cancellationToken);
                if (!cancellationToken.IsCancellationRequested)
                {
                    if (!acquisition)
                    {
                        Logger.Info($"Starting preview");
                        using (var camera = cameraFactory.Create())
                        {
                            await camera.Capture(fileSystem.Path.Combine(engineFolder, "preview.jpg"));
                            Logger.Info($"Preview complete");
                            await previewCompleteSignal.RaiseAsync();
                        }
                    }
                }
            }
        }

        private async Task Sweep(CancellationToken cancellationToken)
        {
            var project = await queue.PopAsync(cancellationToken);
            acquisition = true;
            var job = new Job(fileSystem, jobFolder, project);
            Logger.Info($"Starting job {project.ProjectId.Name}");
            using (var camera = cameraFactory.Create())
            {
                await job.StartAsync(camera, cancellationToken);
                var projectFolder = fileSystem.Path.Combine(projectsFolder, project.ProjectId.Name);
                await Task.Run(() => fileSystem.Directory.Move(jobFolder, projectFolder));
                Logger.Info($"Completed job {project.ProjectId.Name}");
            }
            acquisition = false;
        }
    }
}
