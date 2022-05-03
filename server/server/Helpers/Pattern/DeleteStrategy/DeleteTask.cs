using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DeleteStrategy
{
    public class DeleteTask
    {
        public static void Run(string folderName)
        {
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            FileInfo file = new(pathToSave);
            if (file.Exists)
            {
                file.Delete();
            }
        }
    }
}
