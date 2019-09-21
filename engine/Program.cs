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

        public static async Task MainAsync(string engineJson, ICameraFactory cameraFactory)
        {
            var config = await JsonHelper.ReadFrom<Config>(new FileSystem(), engineJson);

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
                    await RunEngineAsync(config, cameraFactory, cancellationTokenSource.Token);
                }
                catch (TaskCanceledException)
                {
                    Console.WriteLine("Task was cancelled");
                }

                await keyBoardTask;
            }
        }

        static async Task RunEngineAsync(Config config, ICameraFactory cameraFactory, CancellationToken cancellationToken)
        {
            try
            {
                var fileSystem = new FileSystem();
                var engine = new Engine(config, cameraFactory, fileSystem);
                Logger.Info("Starting engine");
                await engine.RunAsync(cancellationToken);
            }
            catch (Exception e)
            {
                Logger.Error(e, $"Error while running engine: {e.Message}");
                throw e;
            }
        }
    }
}
