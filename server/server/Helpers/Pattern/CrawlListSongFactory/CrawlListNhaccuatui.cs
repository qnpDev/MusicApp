using server.Helpers.Pattern.CrawlSongFactory;
using server.Helpers.Pattern.XML2ListSongAdapter;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.CrawlListSongFactory
{
    public class CrawlListNhaccuatui : ICrawlListSong
    {
        public List<CrawlSongModel> GetData(string uri)
        {
            try
            {
                var curl = CurlHelper.Get(uri);
                var matchs = Regex.Matches(curl, "xmlURL = \"(.+?)\";");
                var link = matchs[0].Groups[1].Value;
                IXML2ListSongAdapter parse = new XML2ListSong(new XMLReader(link));
                var result = parse.Get();

                return result;
            }
            catch
            {
                throw new Exception();
            }
        }
    }
}
