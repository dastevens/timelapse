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
            var queueFolder = fileSystem.Path.GetFullPath("queue");
            fileSystem.Directory.CreateDirectory(queueFolder);
            var queue = new Queue(fileSystem, queueFolder);
            await queue.PushAsync(new Project(new ProjectId("Test"), "Try some stuff out", DateTime.Now.AddSeconds(5), 100, TimeSpan.FromMilliseconds(100)));
            var jobFolder = fileSystem.Path.GetFullPath("projects");
            using (var camera = new WebCam())
            {
                var scheduler = new Scheduler(fileSystem, jobFolder, queue, camera);
                Logger.Info("Starting scheduler");
                await scheduler.StartAsync(cancellationToken);
            }
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
