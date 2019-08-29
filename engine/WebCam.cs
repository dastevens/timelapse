using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using OpenCvSharp;

namespace engine
{
    class WebCam : ICamera
    {
        VideoCapture capture = OpenCvSharp.VideoCapture.FromCamera(0);

        public Task Capture(string saveJpegFileAs)
        {
            return Task.Run(() =>
            {
                var mat = new Mat();
                if (capture.Read(mat))
                {
                    mat.SaveImage(saveJpegFileAs);
                }
            });
        }

        public void Dispose()
        {
            capture?.Dispose();
            capture = null;
        }
    }
}
