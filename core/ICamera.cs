using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace core
{
    public interface ICamera : IDisposable
    {
        Task Capture(string saveJpegFileAs);
    }
}
