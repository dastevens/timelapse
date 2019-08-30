using core;
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
            var cameraFactoryAssemblyFileName = args[0];
            MainAsync(cameraFactoryAssemblyFileName).Wait();
        }

        static async Task MainAsync(string cameraFactoryAssemblyFileName)
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
                    await RunEngineAsync(cameraFactoryAssemblyFileName, cancellationTokenSource.Token);
                }
                catch (TaskCanceledException)
                {
                    Console.WriteLine("Task was cancelled");
                }

                await keyBoardTask;
            }
        }

        static async Task RunEngineAsync(string cameraFactoryAssemblyFileName, CancellationToken cancellationToken)
        {
            var fileSystem = new System.IO.Abstractions.FileSystem();
            var cameraFactory = new CameraFactory(cameraFactoryAssemblyFileName);
            var engine = new Engine(cameraFactory, fileSystem);
            Logger.Info("Starting engine");
            await engine.RunAsync(cancellationToken);
        }
    }
}
