using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.CrawlSongFactory
{
    public class CrawlChiasenhac : ICrawlSong
    {
        public CrawlSongModel GetData(string uri)
        {
            try
            {
                var curl = CurlHelper.Get(uri);

                var matchs = Regex.Matches(curl, "\\{\"file\": \"(.+?)\",");
                var src = matchs[0].Groups[1].Value;

                matchs = Regex.Matches(curl, "var musicTitle = \"(.+?)\";");
                var name = matchs[0].Groups[1].Value;

                matchs = Regex.Matches(curl, "<meta property=\"og:image\" content=\"(.+?)\" />");
                var img = matchs[0].Groups[1].Value;

                matchs = Regex.Matches(curl, "var artists = \"(.+?)\";");
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
