using engine;
using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Linq;
using System.Threading.Tasks;

namespace webapi
{
    public class CameraProvider
    {
        private readonly IFileSystem fileSystem;

        public CameraProvider(IFileSystem fileSystem)
        {
            this.fileSystem = fileSystem;
        }

        public ICamera Create()
        {
            return engine.Program.CreateCamera(fileSystem);
        }
    }
}
