using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Helpers;
using server.Helpers.Pattern.TempCrawlSongSingleton;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers.Admin
{
    [Route("api/admin/temp-crawl")]
    [ApiController]
    [Authorize(Roles = "10")]
    public class AdminTempCrawlController : ControllerBase
    {
        readonly TempCrawlSong dataList = TempCrawlSong.GetInstance;
        [HttpGet]
        public IActionResult GetAll(int page = 1, int limit = 5)
        {
            int p = page - 1;
            return Ok(new
            {
                size = dataList.GetSize(),
                data = dataList.GetAll().Skip(limit * p).Take(limit).ToList(),
            });
        }
        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            var item = dataList.Get(id);
            if (item == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Not found!",
                });
            }
            return Ok(new
            {
                success = true,
                message = "Success!",
                data = item,
            });
        }

        [HttpPost]
        public async Task<IActionResult> Add()
        {
            try
            {
                var uid = User.Identity.GetId();
                var formCollection = await Request.ReadFormAsync();

                var name = formCollection["name"][0].ToString().Trim();
                var artist = formCollection["artist"][0].ToString().Trim();
                var img = formCollection["img"][0].ToString().Trim();
                var src = formCollection["src"][0].ToString().Trim();
                var uname = formCollection["uname"][0].ToString().Trim();

                dataList.Add(new TempCrawlSongModel()
                {
                    id = Guid.NewGuid().ToString("N"),
                    Name = name,
                    Artist = artist,
                    Img = img,
                    Src = src,
                    UId = uid,
                    UName = uname,
                    CreatedAt =  DateTime.UtcNow,
                });
                return Ok(new
                {
                    success = true,
                    message = "Successful!",
                });

            }
            catch (Exception e)
            {
                return StatusCode(500, "Internal server error " + e);
            }
        }

        [HttpDelete]
        public IActionResult Clear()
        {
            dataList.Clear();
            return Ok(new
            {
                success = true,
                message = "Successful!",
            });
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            if (id == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Input id",
                });
            }
            if (dataList.Remove(id))
            {
                return Ok(new
                {
                    success = true,
                    message = "Successful!",
                });
            }
            else
            {
                return Ok(new
                {
                    success = false,
                    message = "Not found!",
                });
            }
            
        }

    }
}
