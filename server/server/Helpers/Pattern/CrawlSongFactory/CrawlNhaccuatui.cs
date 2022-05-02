using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.CrawlSongFactory
{
    public class CrawlNhaccuatui : ICrawlSong
    {
        public CrawlSongModel GetData(string uri)
        {
            try
            {
                var curl = CurlHelper.Get(uri);
                var matchs = Regex.Matches(curl, "xmlURL = \"(.+?)\";");
                var link = matchs[0].Groups[1].Value;

                curl = CurlHelper.Get(link);
                matchs = Regex.Matches(curl, @"<!\[CDATA\[(.+?)]]>");

                string name = matchs[0].Groups[1].Value;
                string artist = matchs[2].Groups[1].Value;
                string src = matchs[3].Groups[1].Value;
                string img = matchs[9].Groups[1].Value;

                return new CrawlSongModel()
                {
                    Name = name,
                    Artist = artist,
                    Src = src,
                    Img = img,
                };
            }
            catch
            {
                throw new Exception();
            }
        }
    }
}
