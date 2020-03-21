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
        private readonly Signal requestPreviewSignal;
        private readonly Signal previewCompleteSignal;
        private readonly string fileName;

        public PreviewController(IFileSystem fileSystem, Config config)
        {
            this.fileSystem = fileSystem;
            this.requestPreviewSignal = new Signal(fileSystem, fileSystem.Path.Combine(config.EngineFolder, "request-preview"));
            this.previewCompleteSignal = new Signal(fileSystem, fileSystem.Path.Combine(config.EngineFolder, "preview-complete"));
            this.fileName = fileSystem.Path.Combine(config.EngineFolder, "preview.jpg");
        }

        [HttpGet]
        public async Task<IActionResult> Capture()
        {
            await this.requestPreviewSignal.RaiseAsync();
            await this.previewCompleteSignal.WaitSignalAsync(cancellationToken: System.Threading.CancellationToken.None);
            var fileInfo = fileSystem.FileInfo.FromFileName(fileName);
            var readStream = fileInfo.Open(System.IO.FileMode.Open);

            return File(readStream, "image/jpeg", fileName);
        }
    }
}