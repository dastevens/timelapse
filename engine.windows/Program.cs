using System;

namespace engine.windows
{
    public class Program
    {
        static void Main(string[] args)
        {
            var cameraFactory = new CameraFactory();
            engine.Program.MainAsync(cameraFactory).Wait();
        }
    }
}
