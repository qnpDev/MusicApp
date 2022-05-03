using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Helpers;
using server.Helpers.Pattern.UploadTemplate;
using server.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace server.Controllers.Admin
{
    [Route("api/admin/song")]
    [ApiController]
    [Authorize(Roles = "10")]
    public class AdminSongController : ControllerBase
    {
        MusicContext db = new MusicContext();

        [HttpGet]
        public IActionResult GetSongShow(int page, int limit)
        {
            if (page < 1)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Page start from 1",
                });
            }
            var song = from r in db.Songs
                       select r;
            int p = page - 1;
            return Ok(new
            {
                song = song.Skip(limit * p).Take(limit).ToList(),
                songLength = song.Count(),
            });
        }

        [HttpPut("show")]
        public IActionResult ChangeShow(int id)
        {
                var song = (from r in db.Songs
                            where r.Id == id
                            select r).FirstOrDefault();
                if (song == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not Found or Not permission"
                    });
                }
                else
                {
                    if (song.Show == 1)
                    {
                        song.Show = 0;
                    }
                    else
                    {
                        song.Show = 1;
                    }
                    db.SaveChanges();
                    return Ok(new
                    {
                        success = true,
                        data = new
                        {
                            song.Id,
                            song.Name,
                            song.Artist,
                            song.Src,
                            song.Img,
                            song.CreatedAt,
                            song.Tag,
                            song.Show,
                            song.Listen,
                            song.UpdatedAt,
                            song.Album,
                            song.LocalSrc,
                            song.LocalImg,
                        },
                        message = "Changed success!",
                    });
                
            }
        }

        [HttpDelete("delete")]
        public IActionResult DeleteSong(int id)
        {
                var song = (from r in db.Songs
                            where r.Id == id
                            select r).FirstOrDefault();
                if (song == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "not found id request song"
                    });
                }
                else
                {
                    // delete file song
                    var folderName = Path.Combine("Uploads", "Songs", song.Src);
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    FileInfo file = new FileInfo(pathToSave);
                    if (file.Exists)
                    {
                        file.Delete();
                    }
                    // delete file song image
                    folderName = Path.Combine("Uploads", "Images", "Songs", song.Img);
                    pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    FileInfo file1 = new FileInfo(pathToSave);
                    if (file1.Exists)
                    {
                        file1.Delete();
                    }
                    db.Songs.Remove(song);
                    db.SaveChanges();
                    return Ok(new
                    {
                        success = true,
                        message = "successful!",
                    });
                }
        }

        [HttpPut("update"), DisableRequestSizeLimit]
        public async Task<IActionResult> Update()
        {
            try
            {
                var formCollection = await Request.ReadFormAsync();

                var files = formCollection.Files;
                var changeImg = formCollection["changeImage"][0].ToLower();
                var changeSong = formCollection["changeSong"][0].ToLower();
                var name = formCollection["name"][0].ToString().Trim();
                var tag = formCollection["tag"][0].ToString().Trim();
                var artist = formCollection["artist"][0].ToString().Trim();
                var category = Int32.Parse(formCollection["category"][0]);
                var album = Int32.Parse(formCollection["album"][0]);
                var id = Int32.Parse(formCollection["id"][0]);
                var show = Int32.Parse(formCollection["show"][0]);
                var localImg = Int32.Parse(formCollection["localimg"][0]);
                var localSrc = Int32.Parse(formCollection["localsrc"][0]);

                    var check = (from r in db.Songs
                                 where r.Tag == tag
                                    && r.Id != id
                                 select r).FirstOrDefault();
                    if (check != null)
                    {
                        return Ok(new
                        {
                            success = false,
                            message = "Tag already exist!",
                        });
                    }
                    var song = (from r in db.Songs
                                where r.Id == id
                                select r).FirstOrDefault();
                    if (song == null)
                    {
                        return Ok(new
                        {
                            success = false,
                            message = "Not found draft song"
                        });
                    }

                    song.Name = name;
                    song.Artist = artist;
                    song.Tag = tag;
                    song.Show = show;
                    song.Category = category;
                    song.UpdatedAt = DateTime.Now;
                    song.LocalImg = localImg;
                    song.LocalSrc = localSrc;
                    if (album != -1)
                        song.Album = album;

                if (changeImg.Equals("true") && changeSong.Equals("false"))
                {
                    // delete file song image
                    var folderName = Path.Combine("Uploads", "Images", "Songs", song.Img);
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    FileInfo file = new FileInfo(pathToSave);
                    if (file.Exists)
                    {
                        file.Delete();
                    }
                    if (localImg == 1)
                    {
                        UploadTemplate upload = new UploadImageSong();
                        song.Img = upload.UploadFile(files[0]);
                    }
                    else
                    {
                        song.Img = formCollection["img"][0].ToString().Trim();
                    }

                }

                if (changeSong.Equals("true") && changeImg.Equals("false"))
                {
                    // delete file song
                    var folderName = Path.Combine("Uploads", "Songs", song.Src);
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    FileInfo file = new FileInfo(pathToSave);
                    if (file.Exists)
                    {
                        file.Delete();
                    }
                    if (localSrc == 1)
                    {
                        UploadTemplate upload = new UploadSong();
                        song.Src = upload.UploadFile(files[0]);
                    }
                    else
                    {
                        song.Src = formCollection["src"][0].ToString().Trim();
                    }

                }
                if (changeSong.Equals("true") && changeImg.Equals("true"))
                {
                    UploadTemplate upload;

                    // delete file song image
                    var folderName = Path.Combine("Uploads", "Images", "Songs", song.Img);
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    FileInfo file = new FileInfo(pathToSave);
                    if (file.Exists)
                    {
                        file.Delete();
                    }
                    if (localImg == 1)
                    {
                        upload = new UploadImageSong();
                        song.Img = upload.UploadFile(files[0]);
                    }
                    else
                    {
                        song.Img = formCollection["img"][0].ToString().Trim();
                    }

                    // delete file song
                    folderName = Path.Combine("Uploads", "Songs", song.Src);
                    pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    FileInfo file1 = new FileInfo(pathToSave);
                    if (file1.Exists)
                    {
                        file1.Delete();
                    }
                    if (localSrc == 1)
                    {
                        upload = new UploadSong();
                        song.Src = upload.UploadFile(files[1]);
                    }
                    else
                    {
                        song.Src = formCollection["src"][0].ToString().Trim();
                    }
                }
                if (db.SaveChanges() > 0)
                    {
                        return Ok(new
                        {
                            success = true,
                            message = "Upload success!",
                            data = song,
                        });
                    }
                    else
                    {
                        return Ok(new
                        {
                            success = false,
                            message = "Not change!",
                        });
                    }
                }

            catch (Exception e)
            {
                return StatusCode(500, "Internal server error " + e);
            }
        }

        [HttpPost("create"), DisableRequestSizeLimit]
        public async Task<IActionResult> CreateSong()
        {
            var createBy = User.Identity.GetId();
            try
            {
                var formCollection = await Request.ReadFormAsync();

                var files = formCollection.Files;
                var name = formCollection["name"][0].ToString().Trim();
                var artist = formCollection["artist"][0].ToString().Trim();
                var category = Int32.Parse(formCollection["category"][0]);
                var album = Int32.Parse(formCollection["album"][0]);
                var show = Int32.Parse(formCollection["show"][0]);
                var localImg = Int32.Parse(formCollection["localimg"][0]);
                var localSrc = Int32.Parse(formCollection["localsrc"][0]);


                if (name.Length == 0 || artist.Length == 0 || category == -1)
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
                if (localImg == 1 && localSrc == 0)
                {

                    src = formCollection["src"][0].ToString().Trim();
                    upload = new UploadImageSong();
                    image = upload.UploadFile(files[0]);
                }
                if (localImg == 0 && localSrc == 1)
                {

                    image = formCollection["img"][0].ToString().Trim();
                    upload = new UploadSong();
                    src = upload.UploadFile(files[0]);
                }
                if (localImg == 1 && localSrc == 1)
                {
                    upload = new UploadImageSong();
                    image = upload.UploadFile(files[0]);
                    upload = new UploadSong();
                    src = upload.UploadFile(files[1]);
                }
                if(localImg == 0 && localSrc == 0)
                {
                    image = formCollection["img"][0].ToString().Trim();
                    src = formCollection["src"][0].ToString().Trim();
                }


                //create data
                using (var context = new MusicContext())
                {
                    if (album == -1)
                    {
                        context.Songs.Add(new Song()
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
                        });
                    }
                    else
                    {
                        context.Songs.Add(new Song()
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
                        });
                    }
                    if (context.SaveChanges() > 0)
                    {
                        return Ok(new
                        {
                            success = true,
                            message = "Upload success!"
                        });
                    }
                    else
                    {
                        return Ok(new
                        {
                            success = false,
                            message = "Upload fail!",
                    });
                }
            }
                
            }
            catch (Exception e)
            {
                return StatusCode(500, "Internal server error " + e);
            }
        }
    }
}
