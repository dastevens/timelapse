using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace core
{
    public class Signal
    {
        private readonly IFileSystem fileSystem;
        private readonly string signalFileName;

        public Signal(IFileSystem fileSystem, string signalFileName)
        {
            this.fileSystem = fileSystem;
            this.signalFileName = signalFileName;
        }

        public async Task WaitSignalAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
                if (fileSystem.File.Exists(signalFileName))
                {
                    await Task.Run(() => fileSystem.File.Delete(signalFileName));
                    return;
                }
            }
        }

        public Task RaiseAsync()
        {
            return Task.Run(() =>
            {
                using (var stream = fileSystem.File.Create(signalFileName))
                {
                }
            });
        }
    }
}
