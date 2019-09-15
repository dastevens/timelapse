using core;
using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Linq;
using System.Threading.Tasks;

namespace engine.raspberrypi
{
    public class CameraFactory : ICameraFactory
    {
        private readonly IFileSystem fileSystem;

        public CameraFactory(IFileSystem fileSystem)
        {
            this.fileSystem = fileSystem;
        }

        public ICamera Create()
        {
            return new Camera(fileSystem);
        }
    }
}
