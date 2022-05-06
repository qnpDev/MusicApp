using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DeleteStrategy
{
    public class DeleteImageBanner : IDelete
    {
        public void Delete(string fileName)
        {
            var folderName = Path.Combine("Uploads", "Images", "Banners", fileName);
            DeleteTask.Run(folderName);
        }
    }
}
