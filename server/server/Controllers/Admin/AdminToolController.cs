using Microsoft.AspNetCore.Authorization;
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
    [Authorize(Roles = "10")]
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
