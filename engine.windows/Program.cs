using core;
using System;
using System.IO.Abstractions;

namespace engine.windows
{
    public class Program
    {
        static void Main(string[] args)
        {
            var cameraFactory = new CameraFactory();
            engine.Program.MainAsync("engine.json", cameraFactory).Wait();
        }
    }
}
