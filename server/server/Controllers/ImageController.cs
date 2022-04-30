using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {

        private async Task<IActionResult> getImage(string folder, string filename)
        {
            if (System.IO.File.Exists("Uploads/Images/" + folder + "/" + filename))
            {
                var bytes = await System.IO.File.ReadAllBytesAsync("Uploads/Images/" + folder + "/" + filename);

                return File(bytes, "image/jpeg", Path.GetFileName("Uploads/Images/" + folder + "/" + filename));
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
        [HttpGet("song/{filename}")]
        public async Task<IActionResult> GetImageSongAsync(string filename)
        {
            return await getImage("Songs", filename);
        }

        [HttpGet("user/{filename}")]
        public async Task<IActionResult> GetImageUserAsync(string filename)
        {
            return await getImage("Users", filename);
        }

        [HttpGet("album/{filename}")]
        public async Task<IActionResult> GetImageAlbumAsync(string filename)
        {
            return await getImage("Albums", filename);
        }

        [HttpGet("banner/{filename}")]
        public async Task<IActionResult> GetImageBannerAsync(string filename)
        {
            return await getImage("Banners", filename);
        }

        [HttpGet("category/{filename}")]
        public async Task<IActionResult> GetImageCategoryAsync(string filename)
        {
            return await getImage("Categories", filename);
        }
    }
}
