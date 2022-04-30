using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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
    }
}
