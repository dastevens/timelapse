using NLog;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace engine
{
    public class Job
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly Project project;

        public Job(Project project)
        {
            this.project = project;
        }

        public async Task StartAsync(ICamera camera)
        {
            for (var i = 0; i < project.Images; i++)
            {
                Logger.Info($"{project.ProjectId.Name} {i + 1}/{project.Images}");
                await camera.Capture();
                await Task.Delay(project.Interval);
            }
        }
    }
}
