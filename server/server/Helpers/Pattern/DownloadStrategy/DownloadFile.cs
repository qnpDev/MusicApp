using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DownloadStrategy
{
    public class DownloadFile
    {
        private IDownload iDownload;

        public DownloadFile(IDownload iDownload)
        {
            this.iDownload = iDownload;
        }

        public async Task<string> Download(string uri, string name)
        {
            var s = await this.iDownload.Download(uri, name);
            return s;
        }
    }
}
