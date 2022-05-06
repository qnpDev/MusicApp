using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Helpers;
using server.Helpers.Pattern.UploadTemplate;
using server.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongController : ControllerBase
    {
        [HttpPut("{tag}/listen")]
        public void ListenSong(string tag)
        {
            if (tag != null)
                using (var context = new MusicContext())
                {
                    var song = (from r in context.Songs
                                where r.Tag == tag
                                select r).FirstOrDefault();
                    if (song != null)
                    {
                        song.Listen += 1;
                        context.SaveChanges();
                    }

                }
        }
        [HttpGet("{tag}")]
        public async Task<IActionResult> GetSong(string tag)
        {
            if (tag == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Not found!"
                });
            }
            using (var context = new MusicContext())
            {
                var song = (from r in context.Songs
                            where r.Tag == tag
                                 && r.Show == 1
                            select r).SingleOrDefault();

                if (song != null)
                {
                    var author = await (from r in context.Users
                                        where r.Id == song.CreatedBy
                                        select new { r.Id, r.Name, r.Avatar, r.Roles })
                                        .SingleOrDefaultAsync();
                    var sameAuthor = await (from r in context.Songs
                                            where r.CreatedBy == song.CreatedBy
                                               && r.Show == 1
                                               && r.Id != song.Id
                                            select r).Take(10).ToListAsync();
                    var sameAlbum = new List<Song>();
                    var album = new Album();
                    if (song.Album != null)
                    {
                        sameAlbum = await (from r in context.Songs
                                           where r.Album == song.Album
                                               && r.Show == 1
                                               && r.Id != song.Id
                                           select r).Take(10).ToListAsync();
                        album = await (from r in context.Albums
                                       where r.Id == song.Album
                                       select new Album()
                                       {
                                           Id = r.Id,
                                           Name = r.Name,
                                           Artist = r.Artist,
                                           Tag = r.Tag,
                                           Img = r.Img,
                                           Show = r.Show,
                                           CreatedBy = r.CreatedBy,
                                           CreatedAt = r.CreatedAt
                                       }).SingleOrDefaultAsync();
                    }
                    var sameCategory = await (from r in context.Songs
                                              where r.Category == song.Category
                                                   && r.Show == 1
                                                   && r.Id != song.Id
                                              select r).Take(10).ToListAsync();
                    return Ok(new
                    {
                        success = true,
                        song,
                        author,
                        album,
                        same = new
                        {
                            author = sameAuthor,
                            album = sameAlbum,
                            category = sameCategory,
                        }
                    });
                }
                else
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not found!"
                    });
                }
            }
        }


        //[HttpPut, DisableRequestSizeLimit]
        //[Authorize]
        //public async Task<IActionResult> UploadSong()
        //{
        //    try
        //    {
        //        var formCollection = await Request.ReadFormAsync();
        //        var file = formCollection.Files.First();
        //        var folderName = Path.Combine("Uploads", "Songs");
        //        var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

        //        if (file.Length > 0)
        //        {
        //            var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
        //            var fullPath = Path.Combine(pathToSave, fileName);
        //            var dbPath = Path.Combine(folderName, fileName);

        //            using (var stream = new FileStream(fullPath, FileMode.Create))
        //            {
        //                file.CopyTo(stream);
        //            }
        //            return Ok(new
        //            {
        //                success = true,
        //                message = "Upload success!"
        //            });

        //        }
        //        else
        //        {
        //            return BadRequest();
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return StatusCode(500, "Internal server error: " + e);
        //    }
        //}

    }
}
