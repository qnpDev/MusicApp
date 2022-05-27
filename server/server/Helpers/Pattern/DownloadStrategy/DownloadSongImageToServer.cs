using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DownloadStrategy
{
    public class DownloadSongImageToServer : IDownload
    {
        public async Task<string> Download(string uri, string name)
        {
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), Path.Combine("Uploads", "Images", "Songs"));
            var fileName = SongHelper.ConvertTag(name) + ".jpg";
            var fullPath = Path.Combine(pathToSave, fileName);

            using (var client = new WebClient())
            {
                await client.DownloadFileTaskAsync(new Uri(uri), fullPath);
            }

            return fileName;
        }
    }
}
