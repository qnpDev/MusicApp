using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.CrawlSongFactory
{
    public class CrawlSongFactory
    {
        private CrawlSongFactory() { }
        public static ICrawlSong GetCrawlSong(string crawlSongType)
        {
            switch (crawlSongType.Trim().ToLower())
            {
                case "nhaccuatui":
                    return new CrawlNhaccuatui();
                case "nhacvn":
                    return new CrawlNhacVn();
                case "chiasenhac":
                    return new CrawlChiasenhac();
                default:
                    throw new ArgumentException("This type is unsupported");
            }
        }
    }
}
