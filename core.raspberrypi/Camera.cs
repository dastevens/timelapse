using core;
using NLog;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Unosquare.RaspberryIO;

namespace core.raspberrypi
{
    class Camera : ICamera
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        private readonly System.IO.Abstractions.IFileSystem fileSystem;

        public Camera(System.IO.Abstractions.IFileSystem fileSystem)
        {
            this.fileSystem = fileSystem;
        }

        public async Task Capture(string saveJpegFileAs)
        {
            if (!Pi.Camera.IsBusy)
            {
                var pictureBytes = await Pi.Camera.CaptureImageJpegAsync(640, 480);
                await fileSystem.File.WriteAllBytesAsync(saveJpegFileAs, pictureBytes);
            }
            else
            {
                Logger.Warn($"Camera busy for {saveJpegFileAs}");
            }
        }

        public void Dispose()
        {
        }
    }
}
