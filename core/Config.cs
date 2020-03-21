using System;
using System.Collections.Generic;
using System.Text;

namespace core
{
    public class Config
    {
        public string EngineFolder = AppDataFolder("engine");
        public string JobFolder = AppDataFolder("job");
        public string ProjectsFolder = AppDataFolder("projects");
        public string QueueFolder = AppDataFolder("queue");

        private static string AppDataFolder(string folder)
        {
            return System.IO.Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "timelapse", folder);
        }
    }
}
