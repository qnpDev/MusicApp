using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Helpers;
using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetSearch(string value)
        {
            using(var context = new MusicContext())
            {
                string text = SongHelper.ConvertVietnamese(value.Trim()).ToLower();
                var song = from r in context.Songs
                             where r.Show == 1
                                && (r.Name.ToLower().Contains(text)
                                    || r.Artist.ToLower().Contains(text)
                                    || r.Tag.ToLower().Contains(text))
                           select new { r.Id, r.Tag, r.Name, r.Artist, r.Img, r.Src, r.LocalImg };
                var album = from r in context.Albums
                           where r.Show == 1
                              && (r.Name.ToLower().Contains(text)
                                    || r.Artist.ToLower().Contains(text)
                                    || r.Tag.ToLower().Contains(text))
                            select new { r.Id, r.Tag, r.Name, r.Artist, r.Img, r.LocalImg };
                return Ok(new
                {
                    song = song.ToList(),
                    album = album.ToList(),
                });
            }
        }
    }
}
