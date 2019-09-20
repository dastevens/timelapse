using core;
using System;

namespace engine.windows
{
    public class Program
    {
        static void Main(string[] args)
        {
            var config = new Config();
            var cameraFactory = new CameraFactory();
            engine.Program.MainAsync(config, cameraFactory).Wait();
        }
    }
}
