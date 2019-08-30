using engine;
using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Linq;
using System.Threading.Tasks;

namespace engine
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
