using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using server.Helpers.Pattern.CrawlSongFactory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;

namespace server.Helpers.Pattern.XML2ListSongAdapter
{
    public class XML2ListSong : IXML2ListSongAdapter
    {
        private XMLReader xmlReader;
        public XML2ListSong(XMLReader xmlReader)
        {
            this.xmlReader = xmlReader;

        }
        public List<CrawlSongModel> Get()
        {
            // read xml and return json text
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(this.xmlReader.Read());
            string jsonText = JsonConvert.SerializeXmlNode(doc);

            // convert json text to json object
            dynamic json = System.Text.Json.JsonDocument.Parse(jsonText);
            var j = json.RootElement.GetProperty("tracklist").GetProperty("track").EnumerateArray();
            
            //create list song
            List<CrawlSongModel> list = new();
            foreach(dynamic e in j)
            {
                list.Add(new CrawlSongModel()
                {
                    Name = e.GetProperty("title").GetProperty("#cdata-section").ToString(),
                    Artist = e.GetProperty("creator").GetProperty("#cdata-section").ToString(),
                    Src = e.GetProperty("location").GetProperty("#cdata-section").ToString(),
                    Img = e.GetProperty("coverimage").GetProperty("#cdata-section").ToString(),
                });
            }

            return list;
        }
    }
}
