using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using OpenCvSharp;

namespace core.windows
{
    public class CameraFactory : ICameraFactory
    {
        public ICamera Create()
        {
            return new Camera();
        }
    }
}
