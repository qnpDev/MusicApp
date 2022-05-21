using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Helpers.Pattern.DeleteStrategy;
using server.Helpers.Pattern.UploadTemplate;
using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers.Admin
{
    [Route("api/admin/album")]
    [ApiController]
    [Authorize(Roles = "10")]
    public class AdminAlbumController : ControllerBase
    {
        MusicContext db = new();
        [HttpGet]
        public IActionResult Get(int page = 1, int limit = 6)
        {
            if (page < 1)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Page start from 1",
                });
            }
            var album = from r in db.Albums
                        orderby r.CreatedAt descending
                        select new
                        {
                            r.Id,
                            r.Name,
                            r.Artist,
                            r.Img,
                            r.LocalImg,
                            r.CreatedAt,
                            r.CreatedBy,
                            r.Tag,
                            r.Show,
                            songCount = r.Songs.Count,
                        };
            int p = page - 1;
            return Ok(new
            {
                size = album.Count(),
                data = album.Skip(limit * p).Take(limit).ToList(),
            });
        }

        [HttpPut("show")]
        public IActionResult ChangeShowAlbum(int id)
        {
                var album = (from r in db.Albums
                             where r.Id == id
                             select r).FirstOrDefault();
                if (album == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not Found"
                    });
                }
                else
                {
                    if (album.Show == 1)
                    {
                        var songs = from r in db.Songs
                                    where r.Album == album.Id
                                    select r;
                        album.Show = 0;
                        foreach (Song s in songs)
                        {
                            s.Show = 0;
                        }
                    }
                    else
                    {
                        album.Show = 1;
                    }

                if (db.SaveChanges() > 0)
                {
                    return Ok(new
                    {
                        success = true,
                        data = new
                        {
                            album.Id,
                            album.Name,
                            album.Artist,
                            album.Img,
                            album.CreatedAt,
                            album.Tag,
                            album.Show,
                            album.LocalImg,
                        },
                        message = "Changed success!",
                    });
                }
                else
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Changed fail!",
                    });
                }
                    
                }
        }

        [HttpDelete]
        public IActionResult DeleteAlbum(int id)
        {
            
                var album = (from r in db.Albums
                             where r.Id == id
                             select r).FirstOrDefault();
                if (album == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "not found album"
                    });
                }
                else
                {
                    // delete album image
                    DeleteFile delFile = new(new DeleteImageAlbum());
                    delFile.Delete(album.Img);
                    
                    var songs = from r in db.Songs
                                where r.Album == id
                                select r;
                    foreach (var song in songs)
                    {
                        db.Songs.Remove(song);
                    }
                    db.Albums.Remove(album);
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
                            message = "fail!",
                        });
                    }

                }
        }

        [HttpPut, DisableRequestSizeLimit]
        public async Task<IActionResult> UpdateAlbum()
        {
            try
            {
                var formCollection = await Request.ReadFormAsync();

                var files = formCollection.Files;
                var name = formCollection["name"][0].ToString().Trim();
                var artist = formCollection["artist"][0].ToString().Trim();
                var tag = formCollection["tag"][0].ToString().Trim();
                var show = Int32.Parse(formCollection["show"][0]);
                var id = Int32.Parse(formCollection["id"][0]);
                var changeImg = formCollection["changeImage"][0].ToLower();
                var localImg = Int32.Parse(formCollection["localimg"][0]);



                if (name.Length == 0 || artist.Length == 0)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not enough infomation!"
                    });
                }

                    var album = (from r in db.Albums
                                 where r.Id == id
                                 select r).FirstOrDefault();

                    if (album == null)
                    {
                        return Ok(new
                        {
                            success = false,
                            message = "Can not find album",
                        });
                    }

                    if (changeImg.Equals("true"))
                    {
                        // delete file song image
                        DeleteFile delFile = new(new DeleteImageAlbum());
                        delFile.Delete(album.Img);

                        if (localImg == 1)
                        {
                            // upload file song image
                            UploadTemplate upload = new UploadImageAlbum();
                            album.Img = upload.UploadFile(files[0]);
                        }
                        else
                        {
                            album.Img = formCollection["img"][0].ToString().Trim();
                        }


                    }

                    album.Name = name;
                    album.Artist = artist;
                    album.Show = show;
                    album.UpdatedAt = DateTime.Now;
                    album.Tag = tag;
                    album.LocalImg = localImg;

                    if (db.SaveChanges() > 0)
                    {
                        return Ok(new
                        {
                            success = true,
                            message = "Update success!",
                            data = new
                            {
                                album.Id,
                                album.Name,
                                album.Artist,
                                album.Img,
                                album.CreatedAt,
                                album.Tag,
                                album.Show,
                                album.LocalImg,
                            },
                        });
                    }
                    else
                    {
                        return Ok(new
                        {
                            success = false,
                            message = "Update fail!"
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
