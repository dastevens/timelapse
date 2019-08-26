using NLog;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace engine
{
    public class Scheduler
    {
        private Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly Queue jobQueue;
        private readonly ICamera camera;
        private readonly TimeSpan checkQueuePeriod = TimeSpan.FromSeconds(10);

        public Scheduler(Queue queue, ICamera camera)
        {
            this.jobQueue = queue;
            this.camera = camera;
        }

        public async Task StartAsync()
        {
            while (true)
            {
                await Sweep();
                await Task.Delay(checkQueuePeriod);
            }
        }

        private async Task Sweep()
        {
            var project = await jobQueue.PopAsync();
            var job = new Job(project);
            Logger.Info($"Starting job {project.ProjectId.Name}");
            await job.StartAsync(camera);
            Logger.Info($"Completed job {project.ProjectId.Name}");
        }
    }
}
