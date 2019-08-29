using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace engine
{
    public interface ICamera : IDisposable
    {
        Task Capture(string saveJpegFileAs);
    }
}
