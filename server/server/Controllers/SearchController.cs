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
        public IActionResult GetSearch()
        {
            using(var context = new MusicContext())
            {
                var result = from r in context.Songs
                             where r.Show == 1
                             select new { r.Tag, r.Name, r.Artist, r.Img, r.Src };
                return Ok(result.ToList());
            }
        }
    }
}
