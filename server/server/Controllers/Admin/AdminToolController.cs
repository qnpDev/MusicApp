using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using server.Helpers;
using server.Helpers.Pattern.CrawlListSongFactory;
using server.Helpers.Pattern.CrawlSongFactory;
using server.Helpers.Pattern.DownloadStrategy;
using server.Helpers.Pattern.XML2ListSongAdapter;
using server.Models;
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

        [HttpPost("save-song"), DisableRequestSizeLimit]
        public async Task<IActionResult> CreateSong()
        {
            var createBy = User.Identity.GetId();
            try
            {
                var formCollection = await Request.ReadFormAsync();

                var name = formCollection["name"][0].ToString().Trim();
                var artist = formCollection["artist"][0].ToString().Trim();
                var category = Int32.Parse(formCollection["category"][0]);
                var album = Int32.Parse(formCollection["album"][0]);
                var show = Int32.Parse(formCollection["show"][0]);
                var localImg = 1;
                var localSrc = 1;
                var src = formCollection["src"][0].ToString().Trim();
                var image = formCollection["img"][0].ToString().Trim();


                if (name.Length == 0 || artist.Length == 0 || category == -1)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not enough infomation!"
                    });
                }

                DownloadFile downloadFile;

                downloadFile = new(new DownloadSongToServer());
                var srcResult = await downloadFile.Download(src, name);

                downloadFile = new(new DownloadSongImageToServer());
                var imgResult = await downloadFile.Download(image, name);

                //create data
                using (var context = new MusicContext())
                {
                    if (album == -1)
                    {
                        context.Songs.Add(new Song()
                        {
                            Name = name,
                            Artist = artist,
                            Img = imgResult,
                            Src = srcResult,
                            Category = category,
                            Show = show,
                            LocalImg = localImg,
                            LocalSrc = localSrc,
                            Tag = SongHelper.ConvertTag(name),
                            CreatedBy = createBy,
                            CreatedAt = DateTime.Now,
                        });
                    }
                    else
                    {
                        context.Songs.Add(new Song()
                        {
                            Name = name,
                            Artist = artist,
                            Img = imgResult,
                            Src = srcResult,
                            Category = category,
                            Show = show,
                            LocalImg = localImg,
                            LocalSrc = localSrc,
                            Album = album,
                            Tag = SongHelper.ConvertTag(name),
                            CreatedBy = createBy,
                            CreatedAt = DateTime.Now,
                        });
                    }
                    if (context.SaveChanges() > 0)
                    {
                        return Ok(new
                        {
                            success = true,
                            message = "Upload success!"
                        });
                    }
                    else
                    {
                        return Ok(new
                        {
                            success = false,
                            message = "Upload fail!",
                        });
                    }
                }

            }
            catch (Exception e)
            {
                return StatusCode(500, "Internal server error " + e);
            }
        }
    }
}
