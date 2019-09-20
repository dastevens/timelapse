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
    }
}
