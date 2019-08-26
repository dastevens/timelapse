using NLog;
using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Text;
using System.Threading.Tasks;

namespace engine
{
    public class Scheduler
    {
        private Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly IFileSystem fileSystem;
        private readonly string jobFolder;
        private readonly Queue queue;
        private readonly ICamera camera;
        private readonly TimeSpan checkQueuePeriod = TimeSpan.FromSeconds(10);

        public Scheduler(IFileSystem fileSystem, string jobFolder, Queue queue, ICamera camera)
        {
            this.fileSystem = fileSystem;
            this.jobFolder = jobFolder;
            this.queue = queue;
            this.camera = camera;
        }

        public async Task StartAsync()
        {
            await Task.Run(() => fileSystem.Directory.CreateDirectory(jobFolder));
            while (true)
            {
                await Sweep();
                await Task.Delay(checkQueuePeriod);
            }
        }

        private async Task Sweep()
        {
            var project = await queue.PopAsync();
            var projectFolder = fileSystem.Path.Combine(jobFolder, project.ProjectId.Name);
            var job = new Job(fileSystem, projectFolder, project);
            Logger.Info($"Starting job {project.ProjectId.Name}");
            await job.StartAsync(camera);
            Logger.Info($"Completed job {project.ProjectId.Name}");
        }
    }
}
