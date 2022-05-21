using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.TempCrawlSongSingleton
{
    public class TempCrawlSongModel
    {
        public string id  { get; set; } = Guid.NewGuid().ToString("N");
        public string Name { get; set; }
        public string Artist { get; set; }
        public string Img { get; set; }
        public string Src { get; set; }
        public string UName { get; set; }
        public int UId { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
