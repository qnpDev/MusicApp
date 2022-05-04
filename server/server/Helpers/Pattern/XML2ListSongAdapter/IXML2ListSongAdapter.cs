using server.Helpers.Pattern.CrawlSongFactory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.XML2ListSongAdapter
{
    public interface IXML2ListSongAdapter
    {
        public List<CrawlSongModel> Get();
    }
}
