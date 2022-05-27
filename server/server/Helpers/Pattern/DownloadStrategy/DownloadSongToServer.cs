using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DownloadStrategy
{
    public class DownloadSongToServer : IDownload
    {
        public async Task<string> Download(string uri, string name)
        {
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), Path.Combine("Uploads", "Songs"));
            var fileName = SongHelper.ConvertTag(name) + ".mp3";
            var fullPath = Path.Combine(pathToSave, fileName);

            using (var client = new WebClient())
            {
                await client.DownloadFileTaskAsync(new Uri(uri), fullPath);
            }

            return fileName;
        }
    }
}
