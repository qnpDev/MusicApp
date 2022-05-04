using server.Helpers.Pattern.CrawlSongFactory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.CrawlListSongFactory
{
    public interface ICrawlListSong
    {
        public List<CrawlSongModel> GetData(string uri);
    }
}
