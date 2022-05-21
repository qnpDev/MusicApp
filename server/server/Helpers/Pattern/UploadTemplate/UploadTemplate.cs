using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Net.Http.Headers;

namespace server.Helpers.Pattern.UploadTemplate
{
    public abstract class UploadTemplate
    {
        protected abstract string FolderName();
        protected string SaveFile(IFormFile file, string folderName)
        {
            // upload file
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = SongHelper.ConvertSongFile(ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"'));
            var fullPath = Path.Combine(pathToSave, fileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            return fileName;
        }

        public string UploadFile(IFormFile file)
        {
            string folderName = FolderName();
            string fileName = SaveFile(file, folderName);
            return fileName;
        }
    }
}
