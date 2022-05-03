using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace server.Helpers
{
    public class CurlHelper
    {
        public static string Get(string uri)
        {
            using (WebClient web1 = new WebClient())
            {
                string data = web1.DownloadString(uri);
                //System.Diagnostics.Debug.WriteLine(data);
                return data.ToString();
            }
        }
        public static string Post(string uri, NameValueCollection values)
        {
            using (var client = new WebClient())
            {
                //var values = new NameValueCollection();
                //values["thing1"] = "hello";
                //values["thing2"] = "world";

                var response = client.UploadValues(uri, values);

                return Encoding.Default.GetString(response);
            }
        }
    }
}
