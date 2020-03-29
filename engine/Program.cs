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
            var fileSystem = new FileSystem();
            var config = new Config();
            if (fileSystem.File.Exists(engineJson))
            {
                config = await JsonHelper.ReadFrom<Config>(new FileSystem(), engineJson);
            }

            using (var cancellationTokenSource = new CancellationTokenSource())
            {
                var keyBoardTask = Task.Run(() =>
                {
                    Console.WriteLine("Press enter to cancel");
                    Console.ReadLine();
                    Console.WriteLine("Cancelled by user");
                    cancellationTokenSource.Cancel();
                });

                try
                {
                    await RunEngineAsync(config, cameraFactory, cancellationTokenSource.Token);
                }
                catch (TaskCanceledException e)
                {
                    Logger.Error(e, "RunEngineAsync task was cancelled");
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
