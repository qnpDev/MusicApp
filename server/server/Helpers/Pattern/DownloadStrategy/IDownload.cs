using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DownloadStrategy
{
    public interface IDownload
    {
        public Task<string> Download(string uri, string name);
    }
}
