using NLog;
using System;
using System.IO.Abstractions;
using System.Threading;
using System.Threading.Tasks;

namespace engine
{
    public class Program
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        static void Main(string[] args)
        {
            MainAsync().Wait();
        }

        static async Task MainAsync()
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
            await queue.PushAsync(new Project(new ProjectId("Test"), "Test", DateTime.Now.AddSeconds(5), 10, TimeSpan.FromSeconds(1)));
            var jobFolder = fileSystem.Path.GetFullPath("projects");
            var scheduler = new Scheduler(fileSystem, jobFolder, queue, new CameraProvider(fileSystem));
            Logger.Info("Starting scheduler");
            await scheduler.StartAsync(cancellationToken);
        }
    }
}
