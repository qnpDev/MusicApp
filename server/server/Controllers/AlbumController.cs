using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        MusicContext db = new();
        [HttpGet("user")]
        [Authorize]
        public IActionResult GetListAlbumUser(int id)
        {
                var list = from r in db.Albums
                           where r.CreatedBy == id
                           select new {
                            r.Artist,
                            r.Name,
                            r.Tag,
                            r.Id,
                            r.CreatedAt,
                            r.Show,
                            r.LocalImg,
                            r.Img,
                           };
                return Ok(new
                {
                    success = true,
                    data = list.ToList()
                });
        }

        [HttpGet("list")]
        public IActionResult GetList(int page, int limit)
        {
            if (page < 1)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Page start from 1",
                });
            }
            var album = from r in db.Albums
                        where r.Show == 1
                        orderby r.CreatedAt descending
                        select new
                        {
                            r.Id,
                            r.Name,
                            r.Artist,
                            r.Img,
                            r.LocalImg,
                            r.CreatedAt,
                            r.CreatedBy,
                            r.Tag,
                            r.Show,
                            songCount = r.Songs.Count,
                            user = new
                            {
                                r.CreatedByNavigation.Name
                            }
                        };
            int p = page - 1;
            return Ok(new
            {
                size = album.Count(),
                data = album.Skip(limit * p).Take(limit).ToList(),
            });
        }

        [HttpGet]
        public IActionResult Get(string tag)
        {
            if(tag == null || tag.Trim().Length == 0)
            {
                return Ok(new
                {
                    success = false,
                    messahe = "Not found!",
                });
            }
            var album = (from r in db.Albums
                        where r.Tag == tag
                               && r.Show == 1
                        select new
                        {
                            r.Artist,
                            r.Name,
                            r.Tag,
                            r.Id,
                            r.CreatedAt,
                            r.Show,
                            r.LocalImg,
                            r.Img,
                        }).FirstOrDefault();
            if(album == null)
            {
                return Ok(new
                {
                    success = false,
                    messahe = "Not found!",
                });
            }
            var song = from r in db.Songs
                       where r.Album == album.Id
                            && r.Show == 1
                       select r;
            return Ok(new
            {
                success = true,
                message = "Success!",
                data = new
                {
                    album = album,
                    song = song.ToList()
                }
            });
        }
    }
}
