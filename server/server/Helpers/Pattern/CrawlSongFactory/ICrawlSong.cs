using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.CrawlSongFactory
{
    public interface ICrawlSong
    {
        public CrawlSongModel GetData(string uri);
    }
}
