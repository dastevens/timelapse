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
        private readonly string jobFolder;
        private readonly string projectsFolder;
        private readonly Queue queue;
        private readonly ICameraFactory cameraFactory;

        public Scheduler(IFileSystem fileSystem, string jobFolder, string projectsFolder, Queue queue, ICameraFactory cameraFactory)
        {
            this.fileSystem = fileSystem;
            this.jobFolder = jobFolder;
            this.projectsFolder = projectsFolder;
            this.queue = queue;
            this.cameraFactory = cameraFactory;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                await Sweep(cancellationToken);
            }
        }

        private async Task Sweep(CancellationToken cancellationToken)
        {
            var project = await queue.PopAsync(cancellationToken);
            var job = new Job(fileSystem, jobFolder, project);
            Logger.Info($"Starting job {project.ProjectId.Name}");
            using (var camera = cameraFactory.Create())
            {
                await job.StartAsync(camera, cancellationToken);
                var projectFolder = fileSystem.Path.Combine(projectsFolder, project.ProjectId.Name);
                await Task.Run(() => fileSystem.Directory.Move(jobFolder, projectFolder));
                Logger.Info($"Completed job {project.ProjectId.Name}");
            }
        }
    }
}
