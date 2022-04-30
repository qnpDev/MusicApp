using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetHome()
        {
            using(var context = new MusicContext())
            {
                var banners = from b in context.Banners
                              where b.Show == 1
                              select b;

                var newSongs = (from s in context.Songs
                                where s.Show == 1
                                orderby s.CreatedAt.Date descending
                                select s).Take(10);

                var album = (from a in context.Albums
                             where a.Show == 1
                             orderby a.CreatedAt.Date descending
                             select new
                             {
                                 id = a.Id,
                                 name = a.Name,
                                 artist = a.Artist,
                                 img = a.Img,
                                 tag = a.Tag,
                                 localImg = a.LocalImg,
                             }).Take(10);
                var randomSongs = context.Songs
                    .Where(s => s.Show == 1)
                    .OrderBy(r => Guid.NewGuid())
                    .Take(10);

                //var randomAlbums = context.Albums
                //    .Where(s => s.Show == 1)
                //    .OrderBy(r => Guid.NewGuid())
                //    .Select(s => new 
                //    {
                //        s.Id,
                //        s.Name,
                //        s.Artist,
                //        s.Img,
                //        s.Tag,
                //    })
                //    .Take(10);


                return Ok(new
                {
                    banner = banners.ToList(),
                    newsong = newSongs.ToList(),
                    albums = album.ToList(),
                    randomsong = randomSongs.ToList(),
                    //randomalbum = randomAlbums.ToList(),
                });
            }
        }


        [HttpGet("top")]
        public IActionResult GetHomeTop()
        {
            using (var context = new MusicContext())
            {
                var topWeek = (from q in context.Songs
                               where q.CreatedAt >= DateTime.Now.Date.AddDays(-7)
                                    && q.Show == 1
                               orderby q.Listen descending
                               select q).Take(5);

                var topMonth = (from q in context.Songs
                                where q.CreatedAt >= DateTime.Now.Date.AddDays(-30)
                                    && q.Show == 1
                                orderby q.Listen descending
                                select q).Take(5);
                return Ok(new
                {
                    topweek = topWeek.ToList(),
                    topmonth = topMonth.ToList(),
                });
            }
        }

        [HttpGet("randomalbum")]
        public IActionResult GetRandomAlbum()
        {
            using (var context = new MusicContext())
            {
                var randomAlbums = context.Albums
                    .Where(s => s.Show == 1)
                    .OrderBy(r => Guid.NewGuid())
                    .Select(s => new
                    {
                        s.Id,
                        s.Name,
                        s.Artist,
                        s.Img,
                        s.Tag,
                        s.LocalImg,
                    })
                    .Take(10);
                return Ok(randomAlbums.ToList());
            }
        }
    }
}
