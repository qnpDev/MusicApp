using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SrcController : ControllerBase
    {
        [HttpGet("{filename}")]
        public async Task<IActionResult> GetSongAsync(string filename)
        {
            if(System.IO.File.Exists("Uploads/Songs/" + filename))
            {
                //var memory = new MemoryStream();
                //using (var stream = new FileStream("Uploads/Songs/" + filename, FileMode.Open, FileAccess.Read, FileShare.Read))
                //{
                //    await stream.CopyToAsync(memory);
                //}
                //memory.Position = 0;


                var bytes = await System.IO.File.ReadAllBytesAsync("Uploads/Songs/" + filename);
                //audio / mpeg
                Response.Headers.Add("Accept-Ranges", "bytes");
                return File(bytes, "audio/mpeg", Path.GetFileName("Uploads/Songs/" + filename));


            }
            else
            {
                return NotFound(new
                {
                    success = false,
                    message = "File not found"
                });
            }
        }
    }
}
