using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.XML2ListSongAdapter
{
    public class XMLReader
    {
        private string uri;

        public XMLReader(string uri)
        {
            this.uri = uri;
        }
        public string Read()
        {
            return CurlHelper.Get(this.uri);
        }
    }
}
