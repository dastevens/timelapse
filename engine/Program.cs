using NLog;
using System;
using System.Threading.Tasks;

namespace engine
{
    class Program
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        static async Task Main(string[] args)
        {
            Logger.Info("Creating queue");
            var fileSystem = new System.IO.Abstractions.FileSystem();
            var projectsFolder = fileSystem.Path.GetFullPath("projects");
            fileSystem.Directory.CreateDirectory(projectsFolder);
            var queue = new Queue(fileSystem, projectsFolder);
            await queue.PushAsync(new Project(new ProjectId("Project 1"), "description", DateTime.Now.AddSeconds(30), 3, TimeSpan.FromSeconds(5)));
            await queue.PushAsync(new Project(new ProjectId("Project 2"), "description", DateTime.Now.AddSeconds(60), 2, TimeSpan.FromSeconds(2)));
            var scheduler = new Scheduler(queue, new FakeCamera());
            Logger.Info("Starting scheduler");
            await scheduler.StartAsync();
        }

        private class FakeCamera : ICamera
        {
            private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
            public Task Capture()
            {
                Logger.Info("Click");
                return Task.CompletedTask;
            }
        }
    }
}
