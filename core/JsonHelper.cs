using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Text;
using System.Threading.Tasks;

namespace core
{
    public static class JsonHelper
    {
        private static readonly JsonSerializer serializer = new JsonSerializer();

        public static Task SaveAs<T>(IFileSystem fileSystem, T value, string fileName)
        {
            return Task.Run(() =>
            {
                using (var streamWriter = fileSystem.File.CreateText(fileName))
                {
                    serializer.Serialize(streamWriter, value);
                }
            });
        }

        public static Task<T> ReadFrom<T>(IFileSystem fileSystem, string fileName)
        {
            return Task.Run(() =>
            {
                var file = fileSystem.FileInfo.FromFileName(fileName);
                using (var streamReader = file.OpenText())
                {
                    return (T)serializer.Deserialize(streamReader, typeof(T));
                }
            });
        }
    }
}
