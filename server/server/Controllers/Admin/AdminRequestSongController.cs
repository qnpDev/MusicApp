using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Helpers;
using server.Helpers.Pattern.DeleteStrategy;
using server.Helpers.Pattern.UploadTemplate;
using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers.Admin
{
    [Route("api/admin/request")]
    [ApiController]
    [Authorize(Roles = "10")]
    public class AdminRequestSongController : ControllerBase
    {
        MusicContext db = new();

        [HttpGet]
        public IActionResult GetSong(int page, int limit)
        {
            if (page < 1)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Page start from 1",
                });
            }
            var song = from r in db.Requestsongs
                       where r.Status == 1
                       orderby r.CreatedAt descending
                       select r;
            int p = page - 1;
            return Ok(new
            {
                song = song.Skip(limit * p).Take(limit).ToList(),
                songLength = song.Count(),
            });
        }

        [HttpDelete]
        public IActionResult DeleteSong(int id)
        {
            var song = (from r in db.Requestsongs
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
                DeleteFile delFile;
                delFile = new(new DeleteSong());
                delFile.Delete(song.Src);

                delFile = new(new DeleteImageSong());
                delFile.Delete(song.Img);

                db.Requestsongs.Remove(song);
                db.SaveChanges();
                return Ok(new
                {
                    success = true,
                    message = "successful!",
                });
            }
        }

        [HttpPost]
        public IActionResult Action(int id, string type)
        {
            //System.Diagnostics.Debug.WriteLine("id: " + id);
            var song = (from r in db.Requestsongs
                        where r.Id == id
                        select r).FirstOrDefault();
            if(song == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Not found song!",
                });
            }
            if (type.Trim().ToLower().Equals("accept"))
            {
                db.Songs.Add(new Song()
                {
                    Name = song.Name,
                    Artist = song.Artist,
                    Category = song.Category,
                    Album = song.Album,
                    LocalImg = song.LocalImg,
                    LocalSrc = song.LocalSrc,
                    Img = song.Img,
                    Src = song.Src,
                    Show = song.Show,
                    CreatedBy = song.CreatedBy,
                    Tag = song.Tag,
                });
                db.Requestsongs.Remove(song);
                if(db.SaveChanges() > 0)
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
                        message = "Fail!",
                    });
                }
            }
            else
            {
                song.Status = 2;
                if (db.SaveChanges() > 0)
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
                        message = "Fail!",
                    });
                }
            }
        }

        [HttpPut, DisableRequestSizeLimit]
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
                             select r).FirstOrDefault();
                var check1 = (from r in db.Requestsongs
                              where r.Tag == tag
                                     && r.Id != id
                              select r).FirstOrDefault();
                if (check != null || check1 != null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Tag already exist!",
                    });
                }
                var song = (from r in db.Requestsongs
                            where r.Id == id
                            select r).FirstOrDefault();
                if (song == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not found song"
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
                DeleteFile delFile;
                if (changeImg.Equals("true") && changeSong.Equals("false"))
                {
                    // delete file song image
                    delFile = new(new DeleteImageSong());
                    delFile.Delete(song.Img);

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
                    delFile = new(new DeleteSong());
                    delFile.Delete(song.Src);

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
                    delFile = new(new DeleteImageSong());
                    delFile.Delete(song.Img);

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
                    delFile = new(new DeleteSong());
                    delFile.Delete(song.Src);

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
                        message = "Update success!",
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
    }
}
