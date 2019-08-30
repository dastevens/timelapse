using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Text;
using System.Threading.Tasks;

namespace core
{
    public struct ProjectId
    {
        public ProjectId(string name)
        {
            this.Name = name;
        }
        public string Name { get; }
    }

    public struct Project
    {
        public Project(ProjectId projectId, string description, DateTime start, int images, TimeSpan interval)
        {
            this.ProjectId = projectId;
            this.Description = description;
            this.Start = start;
            this.Images = images;
            this.Interval = interval;
        }

        public ProjectId ProjectId { get; }
        public string Description { get; }
        public DateTime Start { get; }
        public int Images { get; }
        public TimeSpan Interval { get; }

        private static readonly JsonSerializer serializer = new JsonSerializer();

        public static Task SaveAs(IFileSystem fileSystem, Project project, string fileName)
        {
            return Task.Run(() =>
            {
                using (var streamWriter = fileSystem.File.CreateText(fileName))
                {
                    serializer.Serialize(streamWriter, project);
                }
            });
        }

        public static Task<Project> ReadFrom(IFileSystem fileSystem, string fileName)
        {
            return Task.Run(() =>
            {
                var projectFile = fileSystem.FileInfo.FromFileName(fileName);
                using (var streamReader = projectFile.OpenText())
                {
                    return (Project)serializer.Deserialize(streamReader, typeof(Project));
                }
            });
        }
    }
}
