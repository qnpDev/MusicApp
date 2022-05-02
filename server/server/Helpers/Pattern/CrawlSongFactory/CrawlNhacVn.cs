using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.CrawlSongFactory
{
    public class CrawlNhacVn : ICrawlSong
    {
        public CrawlSongModel GetData(string uri)
        {
            try
            {
                var curl = CurlHelper.Get(uri);

                //var matchs = Regex.Matches(curl, "sources: \\[\\{\"file\":\"(.+?)\",\"label\":\"128K\"\\}");
                var matchs = Regex.Matches(curl, "sources: \\[\\{\"file\":\"(.+?)\",");
                var src = matchs[0].Groups[1].Value.Replace("\\", "");

                matchs = Regex.Matches(curl, "title:'(.+?)',");
                var name = matchs[0].Groups[1].Value;

                matchs = Regex.Matches(curl, "thumb : '(.+?)',");
                var img = matchs[0].Groups[1].Value;

                matchs = Regex.Matches(curl, "description:'(.+?)',");
                var artist = matchs[0].Groups[1].Value;

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
