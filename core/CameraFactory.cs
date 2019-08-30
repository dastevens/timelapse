using System;
using System.Collections.Generic;
using System.Text;

namespace core
{
    public class CameraFactory : ICameraFactory
    {
        private readonly string assemblyFileName;

        public CameraFactory(string assemblyFileName)
        {
            this.assemblyFileName = assemblyFileName;
            throw new NotImplementedException();
        }

        public ICamera Create()
        {
            throw new NotImplementedException();
        }
    }
}
