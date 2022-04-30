using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.UploadTemplate
{
    public class UploadImageSong : UploadTemplate
    {
        protected override string FolderName()
        {
            return Path.Combine("Uploads", "Images", "Songs");
        }
    }
}
