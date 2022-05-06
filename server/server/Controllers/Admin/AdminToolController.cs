using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using server.Helpers;
using server.Helpers.Pattern.CrawlListSongFactory;
using server.Helpers.Pattern.CrawlSongFactory;
using server.Helpers.Pattern.XML2ListSongAdapter;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;

namespace server.Controllers.Admin
{
    [Route("api/admin/tool")]
    [ApiController]
    [Authorize(Roles = "10")]
    public class AdminToolController : ControllerBase
    {
        [HttpGet("{type}")]
        public IActionResult GetSong(string uri, string type)
        {
            if(uri == null || type == null || uri.Trim().Length == 0 || type.Trim().Length == 0)
            {
                return Ok(new
                {
                    success = false,
                    message = "Enter link!",
                });
            }

            try
            {
                ICrawlSong crawl = CrawlSongFactory.GetCrawlSong(type);
                return Ok(crawl.GetData(uri));
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

        [HttpGet("list-{type}")]
        public IActionResult GetListSong(string uri, string type)
        {
            if (uri.Trim().Length == 0 || type.Trim().Length == 0)
            {
                return BadRequest("Enter link or type!");
            }

            try
            {
                ICrawlListSong crawl = CrawlListSongFactory.GetList(type);
                return Ok(crawl.GetData(uri));
                //IXML2ListSongAdapter parse = new XML2ListSong(new XMLReader(uri));
                //return Ok(parse.Get());
                
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
