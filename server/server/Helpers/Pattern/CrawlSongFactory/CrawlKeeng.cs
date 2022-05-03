using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.CrawlSongFactory
{
    public class CrawlKeeng : ICrawlSong
    {
        public CrawlSongModel GetData(string uri)
        {
            try
            {
                var values = new NameValueCollection();
                values["link"] = uri;
                var curl = CurlHelper.Post("https://m.vuiz.net/getlink/keeng.vn/keengapi.php", values);

                var matchs = Regex.Matches(curl, "data-src=(.+?)data-type=");
                var src = Regex.Unescape(matchs[0].Groups[1].Value.Trim()).Replace("\"", "");

                matchs = Regex.Matches(curl, "data-title=(.+?)data-album=");
                var name = Regex.Unescape(matchs[0].Groups[1].Value.Trim()).Replace("\"", "");

                matchs = Regex.Matches(curl, "data-image=(.+?)data-duration=");
                var img = Regex.Unescape(matchs[0].Groups[1].Value.Trim()).Replace("\"", "").Replace("https://try.imgeng.in/w_300/f_webp/", "");

                matchs = Regex.Matches(curl, "data-artist=(.+?)data-title=");
                var artist = Regex.Unescape(matchs[0].Groups[1].Value.Trim()).Replace("\"", "");

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
