﻿using core;
using System;
using System.IO.Abstractions;
using System.Threading;
using System.Threading.Tasks;

namespace engine.raspberrypi
{
    public class Program
    {
        static void Main(string[] args)
        {
            var config = new Config();
            var cameraFactory = new CameraFactory(new FileSystem());
            engine.Program.MainAsync(config, cameraFactory).Wait();
        }
    }
}
