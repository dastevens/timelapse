using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using OpenCvSharp;

namespace engine
{
    class WebCam : ICamera
    {
        public Task Capture(string saveJpegFileAs)
        {
            return Task.Run(() =>
            {
                using (var capture = OpenCvSharp.VideoCapture.FromCamera(0))
                {
                    var mat = new Mat();
                    if (capture.Read(mat))
                    {
                        mat.SaveImage(saveJpegFileAs);
                    }
                }
            });
        }
    }
}
