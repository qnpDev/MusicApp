using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Helpers;
using server.Helpers.Pattern.CrawlSongFactory;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace server.Controllers.Admin
{
    [Route("api/admin/tool")]
    [ApiController]
    public class AdminToolController : ControllerBase
    {
        [HttpGet("{type}")]
        public IActionResult GetNhaccuatui(string uri, string type)
        {
            if(uri.Trim().Length == 0)
            {
                return BadRequest("Enter link!");
            }

            try
            {
                ICrawlSong crawl = CrawlSongFactory.GetCrawlSong(type);
                return Ok(crawl.GetData(uri));
                //var curl = CurlHelper.Get(uri);
                //var matchs = Regex.Matches(curl, "xmlURL = \"(.+?)\";");
                //var link = matchs[0].Groups[1].Value;

                //curl = CurlHelper.Get(link);
                //matchs = Regex.Matches(curl, @"<!\[CDATA\[(.+?)]]>");

                //string name = matchs[0].Groups[1].Value;
                //string artist = matchs[2].Groups[1].Value;
                //string src = matchs[3].Groups[1].Value;
                //string img = matchs[9].Groups[1].Value;

                ////System.Diagnostics.Debug.WriteLine(src);
                ////System.Diagnostics.Debug.WriteLine(matchs[0].Groups[1].Value);

                //return Ok(new
                //{
                //    name,
                //    artist,
                //    src,
                //    img,
                //});
            }
            catch (Exception)
            {
                return Ok(new
                {
                    success = false,
                    message = "Not found song, check your link!"
                });
            }
        }

    }
}
