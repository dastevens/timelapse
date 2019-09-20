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
    public class ProjectController : ControllerBase
    {
        private readonly IFileSystem fileSystem;
        private readonly string projectsFolder;

        public ProjectController(IFileSystem fileSystem, Config config)
        {
            this.fileSystem = fileSystem;
            this.projectsFolder = config.ProjectsFolder;
        }

        [HttpGet()]
        public Task<IEnumerable<string>> Projects()
        {
            return Task.Run(() => fileSystem.Directory.EnumerateDirectories(projectsFolder));
        }

        [HttpGet("{id}/status")]
        public async Task<JobStatus> Status(string id)
        {
            var projectFolder = fileSystem.Path.Combine(projectsFolder, id);
            return await Job.ReadJobStatusAsync(fileSystem, projectFolder);
        }

        [HttpGet("{id}/images")]
        public Task<IEnumerable<string>> Images(string id)
        {
            var projectFolder = fileSystem.Path.Combine(projectsFolder, id);
            return Task.Run(() => fileSystem.Directory.EnumerateFiles(projectFolder, "*.jpg"));
        }

        [HttpGet("{id}/image/{imageJpg}")]
        public async Task<IActionResult> Image(string id, string imageJpg)
        {
            var projectFolder = fileSystem.Path.Combine(projectsFolder, id);
            var fileName = fileSystem.Path.Combine(projectFolder, imageJpg);
            var fileInfo = fileSystem.FileInfo.FromFileName(fileName);
            var readStream = fileInfo.Open(System.IO.FileMode.Open);
            return File(readStream, "image/jpeg", fileName);
        }
    }
}