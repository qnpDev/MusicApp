using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.CrawlListSongFactory
{
    public class CrawlListSongFactory
    {
        private CrawlListSongFactory() { }
        public static ICrawlListSong GetList(string crawlSongType)
        {
            switch (crawlSongType.Trim().ToLower())
            {
                case "nhaccuatui":
                    return new CrawlListNhaccuatui();
                //case "nhacvn":
                //    return new CrawlNhacVn();
                //case "chiasenhac":
                //    return new CrawlChiasenhac();
                //case "keeng":
                //    return new CrawlKeeng();
                default:
                    throw new ArgumentException("This type is unsupported");
            }
        }
    }
}
