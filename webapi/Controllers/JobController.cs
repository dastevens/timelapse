using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Linq;
using System.Threading.Tasks;
using core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private readonly IFileSystem fileSystem;
        private readonly string jobFolder;

        public JobController(IFileSystem fileSystem, Config config)
        {
            this.fileSystem = fileSystem;
            this.jobFolder = config.JobFolder;
        }

        [HttpGet("status")]
        public async Task<JobStatus> Status()
        {
            return await Job.ReadJobStatusAsync(fileSystem, jobFolder);
        }

        [HttpGet("images")]
        public Task<IEnumerable<string>> Images()
        {
            return Task.Run(() =>
            {
                if (fileSystem.Directory.Exists(jobFolder))
                {
                    return fileSystem.Directory.EnumerateFiles(jobFolder, "*.jpg");
                }
                return new string[0];
            });
        }

        [HttpGet("image/{imageJpg}")]
        public IActionResult Image(string imageJpg)
        {
            var fileName = fileSystem.Path.Combine(jobFolder, imageJpg);
            var fileInfo = fileSystem.FileInfo.FromFileName(fileName);
            var readStream = fileInfo.Open(System.IO.FileMode.Open);
            return File(readStream, "image/jpeg", fileName);
        }

        // POST: api/Job/abort
        [HttpPost("abort")]
        public async Task Abort()
        {
            await Job.SendAbortSignalAsync(fileSystem, jobFolder);
        }
    }
}