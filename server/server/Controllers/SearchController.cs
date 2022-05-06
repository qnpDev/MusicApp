using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        public IActionResult GetSearch(string searchText)
        {
            using(var context = new MusicContext())
            {
                var song = from r in context.Songs
                             where r.Show == 1
                                && (
                                    r.Name.ToLower().Contains(searchText.ToLower())
                                    || r.Artist.ToLower().Contains(searchText.ToLower())
                                )
                             select new { r.Id, r.Tag, r.Name, r.Artist, r.Img, r.Src };
                var album = from r in context.Albums
                           where r.Show == 1
                              && (
                                  r.Name.ToLower().Contains(searchText.ToLower())
                                  || r.Artist.ToLower().Contains(searchText.ToLower())
                              )
                           select new { r.Id, r.Tag, r.Name, r.Artist, r.Img };
                return Ok(new
                {
                    song = song.ToList(),
                    album = album.ToList(),
                });
            }
        }
    }
}
