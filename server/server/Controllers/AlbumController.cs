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
        [HttpGet("user")]
        [Authorize]
        public IActionResult GetListAlbumUser(int id)
        {

            using (var context = new MusicContext())
            {
                var list = from r in context.Albums
                           where r.CreatedBy == id
                           select r;
                return Ok(new
                {
                    success = true,
                    data = list.ToList()
                });
            }
        }
    }
}
