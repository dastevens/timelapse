using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Unosquare.RaspberryIO;

namespace engine
{
    class PiCamera : ICamera
    {
        private readonly System.IO.Abstractions.IFileSystem fileSystem;

        public PiCamera(System.IO.Abstractions.IFileSystem fileSystem)
        {
            this.fileSystem = fileSystem;
        }

        public async Task Capture(string saveJpegFileAs)
        {
            var pictureBytes = await Pi.Camera.CaptureImageJpegAsync(640, 480);
            await Task.Run(() =>
            {
                if (fileSystem.File.Exists(saveJpegFileAs))
                {
                    fileSystem.File.Delete(saveJpegFileAs);
                }

                fileSystem.File.WriteAllBytes(saveJpegFileAs, pictureBytes);
            });
        }
    }
}
