using System;
using System.Collections.Generic;
using System.Text;

namespace core
{
    public interface ICameraFactory
    {
        ICamera Create();
    }
}
