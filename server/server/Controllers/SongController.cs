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
                                select r).SingleOrDefault();
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

        [HttpPut, DisableRequestSizeLimit]
        [Authorize]
        public async Task<IActionResult> UploadSong()
        {
            try
            {
                var formCollection = await Request.ReadFormAsync();
                
                var files = formCollection.Files;
                var name = formCollection["name"][0].ToString().Trim();
                var artist = formCollection["artist"][0].ToString().Trim();
                var category = Int32.Parse(formCollection["category"][0]);
                var album = Int32.Parse(formCollection["album"][0]);
                var show = Int32.Parse(formCollection["show"][0]);
                var status = Int32.Parse(formCollection["status"][0]);
                var localImg = Int32.Parse(formCollection["localimg"][0]);
                var localSrc = Int32.Parse(formCollection["localsrc"][0]);
                var createBy = Int32.Parse(formCollection["uid"][0]);

                //if (files.Any(f => f.Length < 2))
                //{
                //    return Ok(new
                //    {
                //        success = false,
                //        message = "Not enough file!"
                //    });
                //}

                if(name.Length == 0 || artist.Length == 0 || category == -1)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not enough infomation!"
                    });
                }
                string image = null;
                string src = null;
                UploadTemplate upload;
                if(localImg == 1 && localSrc == 0)
                {
                    // file song image
                    //var folderName = Path.Combine("Uploads", "Images", "Songs");
                    //var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    //var fileName = SongHelper.ConvertSongFile(ContentDispositionHeaderValue.Parse(files[0].ContentDisposition).FileName.Trim('"'));
                    //var fullPath = Path.Combine(pathToSave, fileName);
                    //image = fileName;
                    src = formCollection["src"][0].ToString().Trim();
                    //using (var stream = new FileStream(fullPath, FileMode.Create))
                    //{
                    //    files[0].CopyTo(stream);
                    //}
                    upload = new UploadImageSong();
                    image = upload.UploadFile(files[0]);
                }
                if(localImg == 0 && localSrc == 1)
                {
                    // file song
                    //var folderName = Path.Combine("Uploads", "Songs");
                    //var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    //var fileName = SongHelper.ConvertSongFile(ContentDispositionHeaderValue.Parse(files[1].ContentDisposition).FileName.Trim('"'));
                    //var fullPath = Path.Combine(pathToSave, fileName);
                    //src = fileName;
                    image = formCollection["img"][0].ToString().Trim();
                    //using (var stream = new FileStream(fullPath, FileMode.Create))
                    //{
                    //    files[0].CopyTo(stream);
                    //}
                    upload = new UploadSong();
                    src = upload.UploadFile(files[0]);
                }
                if(localImg == 1 && localSrc == 1)
                {
                    //// file song image
                    //var folderName = Path.Combine("Uploads", "Images", "Songs");
                    //var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    //var fileName = SongHelper.ConvertSongFile(ContentDispositionHeaderValue.Parse(files[0].ContentDisposition).FileName.Trim('"'));
                    //var fullPath = Path.Combine(pathToSave, fileName);
                    //image = fileName;
                    //using (var stream = new FileStream(fullPath, FileMode.Create))
                    //{
                    //    files[0].CopyTo(stream);
                    //}

                    //// file song
                    //folderName = Path.Combine("Uploads", "Songs");
                    //pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    //fileName = SongHelper.ConvertSongFile(ContentDispositionHeaderValue.Parse(files[1].ContentDisposition).FileName.Trim('"'));
                    //fullPath = Path.Combine(pathToSave, fileName);
                    //src = fileName;
                    //using (var stream = new FileStream(fullPath, FileMode.Create))
                    //{
                    //    files[1].CopyTo(stream);
                    //}
                    upload = new UploadImageSong();
                    image = upload.UploadFile(files[0]);
                    upload = new UploadSong();
                    src = upload.UploadFile(files[1]);
                }
                

                //create data
                using (var context = new MusicContext())
                {
                    if(album == -1)
                    {
                        context.Requestsongs.Add(new Requestsong()
                        {
                            Name = name,
                            Artist = artist,
                            Img = image,
                            Src = src,
                            Category = category,
                            Show = show,
                            LocalImg = localImg,
                            LocalSrc = localSrc,
                            Tag = SongHelper.ConvertTag(name),
                            CreatedBy = createBy,
                            Status = status,
                        });
                    }
                    else
                    {
                        context.Requestsongs.Add(new Requestsong()
                        {
                            Name = name,
                            Artist = artist,
                            Img = image,
                            Src = src,
                            Category = category,
                            Show = show,
                            LocalImg = localImg,
                            LocalSrc = localSrc,
                            Album = album,
                            Tag = SongHelper.ConvertTag(name),
                            CreatedBy = createBy,
                            Status = status,
                        });
                    }
                    
                    context.SaveChanges();
                }


                //if (files.Any(f => f.Length == 0))
                //{
                //    return BadRequest();
                //}
                //foreach (var file in files)
                //{
                //    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                //    System.Diagnostics.Debug.WriteLine(fileName);
                //    var fullPath = Path.Combine(pathToSave, fileName);
                //    var dbPath = Path.Combine(folderName, fileName);
                //    using (var stream = new FileStream(fullPath, FileMode.Create))
                //    {
                //        file.CopyTo(stream);
                //    }
                //}
                return Ok(new
                {
                    success = true,
                    message = "Upload success!"
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, "Internal server error " + e);
            }
        }

    }
}
