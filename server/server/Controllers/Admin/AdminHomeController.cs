using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Helpers.Pattern.TempCrawlSongSingleton;
using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers.Admin
{
    [Route("api/admin/home")]
    [ApiController]
    [Authorize(Roles = "10")]
    public class AdminHomeController : ControllerBase
    {
        MusicContext db = new MusicContext();

        [HttpGet]
        public IActionResult GetAdminHome()
        {
            TempCrawlSong dataList = TempCrawlSong.GetInstance;
            var user = from r in db.Users
                       where r.Roles != 10
                       select r;
            var song = from r in db.Songs
                       select r;
            var request = from r in db.Requestsongs
                          where r.Status == 1
                          select r;
            var album = from r in db.Albums
                        select r;
            var category = from r in db.Categories
                           select r;
            var tempCrawl = dataList.GetSize();
            var banner = from r in db.Banners
                         select r;
            var admin = from r in db.Users
                        where r.Roles == 10
                        select r;
            return Ok(new
            {
                user = user.Count(),
                song = song.Count(),
                request = request.Count(),
                album = album.Count(),
                category = category.Count(),
                tempCrawl = tempCrawl,
                banner = banner.Count(),
                admin = admin.Count(),
            });

        }

        [HttpGet("allalbum")]
        public IActionResult GetAllAlbum()
        {
            var album = from r in db.Albums
                        select new
                        {
                            r.Id,
                            r.Name,
                            r.Artist,
                            r.Tag,
                            r.Img,
                            r.Show,
                            r.CreatedAt,
                            r.LocalImg,
                        };
            return Ok(album.ToList());
        }

        [HttpGet("allcategory")]
        public IActionResult GetAllCategory()
        {
            var category = from r in db.Categories
                           select r;
            return Ok(category.ToList());
        }
    }
}
