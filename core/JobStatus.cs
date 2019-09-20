using NLog;
using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace core
{
    public struct JobStatus
    {
        public JobStatus(string projectFile, DateTime nextCapture, int imageNumber)
        {
            ProjectFile = projectFile;
            NextCapture = nextCapture;
            ImageNumber = imageNumber;
        }

        public string ProjectFile { get; }
        public DateTime NextCapture { get; }
        public int ImageNumber { get; }
    }
}
