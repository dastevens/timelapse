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
            var jobFolder = fileSystem.Path.GetFullPath("projects");
            using (var camera = CreateCamera(fileSystem))
            {
                var scheduler = new Scheduler(fileSystem, jobFolder, queue, camera);
                Logger.Info("Starting scheduler");
                await scheduler.StartAsync(cancellationToken);
            }
        }

        public static ICamera CreateCamera(IFileSystem fileSystem)
        {
            Logger.Info($"Platform {Environment.OSVersion.Platform}");
            switch (Environment.OSVersion.Platform)
            {
                case PlatformID.Win32NT:
                    return new WebCam();
                case PlatformID.Unix:
                    return new PiCamera(fileSystem);
                default:
                    throw new NotSupportedException($"Unsupported Platform {Environment.OSVersion.Platform}");
            }
        }
    }
}
