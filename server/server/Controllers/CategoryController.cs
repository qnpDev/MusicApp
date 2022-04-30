using Microsoft.AspNetCore.Authorization;
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
    public class CategoryController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetListCategory()
        {
            using (var context = new MusicContext())
            {
                var categories = from r in context.Categories
                                 where r.Show == 1
                                 select r;
                return Ok(new
                {
                    success = true,
                    data = categories.ToList()
                });
            }
        }
    }
}
