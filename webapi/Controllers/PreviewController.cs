using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Linq;
using System.Threading.Tasks;
using core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PreviewController : ControllerBase
    {
        private readonly IFileSystem fileSystem;
        private readonly ICameraFactory cameraFactory;

        public PreviewController(IFileSystem fileSystem, ICameraFactory cameraFactory)
        {
            this.fileSystem = fileSystem;
            this.cameraFactory = cameraFactory;
        }

        [HttpGet]
        public async Task<IActionResult> Capture()
        {
            var fileName = fileSystem.Path.Combine(fileSystem.Path.GetTempPath(), "preview.jpg");
            using (var camera = cameraFactory.Create())
            {
                await camera.Capture(fileName);
            }

            var fileInfo = fileSystem.FileInfo.FromFileName(fileName);
            var readStream = fileInfo.Open(System.IO.FileMode.Open);

            return File(readStream, "image/jpeg", fileName);
        }
    }
}