using NLog;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace engine
{
    class Program
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        static async Task Main(string[] args)
        {
            using (var cancellationTokenSource = new CancellationTokenSource())
            {
                var keyBoardTask = Task.Run(() =>
                {
                    Console.WriteLine("Press enter to cancel");
                    Console.ReadKey();
                    Console.WriteLine("Cancelled");
                    cancellationTokenSource.Cancel();
                });

                try
                {
                    await RunEngineAsync(cancellationTokenSource.Token);
                }
                catch (TaskCanceledException)
                {
                    Console.WriteLine("Task was cancelled");
                }

                await keyBoardTask;
            }
        }

        static async Task RunEngineAsync(CancellationToken cancellationToken)
        {
            Logger.Info("Creating queue");
            var fileSystem = new System.IO.Abstractions.FileSystem();
            var projectsFolder = fileSystem.Path.GetFullPath("projects");
            fileSystem.Directory.CreateDirectory(projectsFolder);
            var queue = new Queue(fileSystem, projectsFolder);
            await queue.PushAsync(new Project(new ProjectId("Project 0"), "description", DateTime.Now.AddSeconds(5), 5, TimeSpan.FromSeconds(1)));
            await queue.PushAsync(new Project(new ProjectId("Project 1"), "description", DateTime.Now.AddSeconds(30), 3, TimeSpan.FromSeconds(5)));
            await queue.PushAsync(new Project(new ProjectId("Project 2"), "description", DateTime.Now.AddSeconds(60), 2, TimeSpan.FromSeconds(2)));
            var jobFolder = fileSystem.Path.GetFullPath("jobs");
            var camera = new WebCam();
            var scheduler = new Scheduler(fileSystem, jobFolder, queue, camera);
            Logger.Info("Starting scheduler");
            await scheduler.StartAsync(cancellationToken);
        }

        private class FakeCamera : ICamera
        {
            private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
            public Task Capture(string saveJpegFileAs)
            {
                Logger.Info($"Click: {saveJpegFileAs}");
                return Task.CompletedTask;
            }
        }
    }
}
