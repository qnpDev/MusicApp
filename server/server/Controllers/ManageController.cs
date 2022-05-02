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

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ManageController : ControllerBase
    {
        [HttpGet("song/getsong")]
        public IActionResult GetSong(int page, int limit)
        {
            int id = User.Identity.GetId();
            if (page < 1)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Page start from 1",
                });
            }
            using (var context = new MusicContext())
            {
                var song = from c in context.Categories
                           from s in context.Songs
                           join a in context.Albums on s.Album equals a.Id into albumJoin
                           from al in albumJoin.DefaultIfEmpty()
                           where s.CreatedBy == id
                                && s.Category == c.Id
                           select new
                           {
                               song = new
                               {
                                   s.Id,
                                   s.Name,
                                   s.Artist,
                                   s.Src,
                                   s.Img,
                                   s.CreatedAt,
                                   s.Tag,
                                   s.Category,
                                   s.Show,
                                   s.Listen,
                                   s.UpdatedAt,
                                   s.Album,
                                   s.LocalSrc,
                                   s.LocalImg,
                               },
                               category = new
                               {
                                   c.Id,
                                   c.Name,
                                   c.Avatar,
                                   c.LocalAvatar,
                                   c.Tag,
                               },
                               album = new
                               {
                                   id = al != null ? al.Id : -1,
                                   name = al != null ? al.Name : "",
                                   artist = al != null ? al.Artist : "",
                                   tag = al != null ? al.Tag : "",
                                   img = al != null ? al.Img : "",
                                   localImg = al != null ? al.LocalImg : 0,
                               },
                           };
                int p = page - 1;
                return Ok(new
                {
                    songLength = song.Count(),
                    song = song.Skip(limit * p).Take(limit).ToList(),

                });
            }
        }

        [HttpGet("song/getrequest")]
        public IActionResult GetRequestSong(int page, int limit)
        {
            int id = User.Identity.GetId();
            if (page < 1)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Page start from 1",
                });
            }
            using (var context = new MusicContext())
            {
                var requestSong = from c in context.Categories
                                  from s in context.Requestsongs
                                  join a in context.Albums on s.Album equals a.Id into albumJoin
                                  from al in albumJoin.DefaultIfEmpty()
                                  where s.CreatedBy == id
                                       && s.Category == c.Id
                                       && s.Status == 1
                                  select new
                                  {
                                      song = new
                                      {
                                          s.Id,
                                          s.Name,
                                          s.Artist,
                                          s.Src,
                                          s.Img,
                                          s.Category,
                                          s.CreatedAt,
                                          s.Tag,
                                          s.Show,
                                          s.UpdatedAt,
                                          s.Album,
                                          s.LocalImg,
                                          s.LocalSrc,
                                      },
                                      category = new
                                      {
                                          c.Id,
                                          c.Name,
                                          c.Avatar,
                                          c.Tag,
                                          c.LocalAvatar,
                                      },
                                      album = new
                                      {
                                          id = al != null ? al.Id : -1,
                                          name = al != null ? al.Name : "",
                                          artist = al != null ? al.Artist : "",
                                          tag = al != null ? al.Tag : "",
                                          img = al != null ? al.Img : "",
                                          localImg = al != null ? al.LocalImg : 0,
                                      },
                                  };
                int p = page - 1;
                return Ok(new
                {
                    requestLength = requestSong.Count(),
                    request = requestSong.Skip(limit * p).Take(limit).ToList(),

                });
            }
        }

        [HttpGet("song/getdraft")]
        public IActionResult GetDraftSong(int page, int limit)
        {
            int id = User.Identity.GetId();
            if (page < 1)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Page start from 1",
                });
            }
            using (var context = new MusicContext())
            {
                var draft = from c in context.Categories
                            from s in context.Requestsongs
                            join a in context.Albums on s.Album equals a.Id into albumJoin
                            from al in albumJoin.DefaultIfEmpty()
                            where s.CreatedBy == id
                                 && s.Category == c.Id
                                 && s.Status == 0
                            select new
                            {
                                song = new
                                {
                                    s.Id,
                                    s.Name,
                                    s.Artist,
                                    s.Src,
                                    s.Img,
                                    s.Category,
                                    s.CreatedAt,
                                    s.Tag,
                                    s.Show,
                                    s.UpdatedAt,
                                    s.Album,
                                    s.LocalImg,
                                    s.LocalSrc,
                                },
                                category = new
                                {
                                    c.Id,
                                    c.Name,
                                    c.Avatar,
                                    c.Tag,
                                    c.LocalAvatar,
                                },
                                album = new
                                {
                                    id = al != null ? al.Id : -1,
                                    name = al != null ? al.Name : "",
                                    artist = al != null ? al.Artist : "",
                                    tag = al != null ? al.Tag : "",
                                    img = al != null ? al.Img : "",
                                    localImg = al != null ? al.LocalImg : 0,
                                },
                            };
                int p = page - 1;
                return Ok(new
                {
                    draftLength = draft.Count(),
                    draft = draft.Skip(limit * p).Take(limit).ToList(),

                });
            }
        }

        [HttpPut("song/show")]
        public IActionResult ChangeShow(int id)
        {
            int uid = User.Identity.GetId();
            using (var context = new MusicContext())
            {
                var song = (from r in context.Songs
                           where r.CreatedBy == uid
                                && r.Id == id
                           select r).FirstOrDefault();
                if(song == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not Found or Not permission"
                    });
                }
                else
                {
                    if(song.Show == 1)
                    {
                        song.Show = 0;
                    }
                    else
                    {
                        song.Show = 1;
                    }
                    context.SaveChanges();
                    return Ok(new
                    {
                        success = true,
                        data = new {
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
        }

        [HttpPut("song/sendrequest")]
        public IActionResult SendRequest(int  id)
        {
            int uid = User.Identity.GetId();
            using (var context = new MusicContext())
            {
                var songrequest = (from r in context.Requestsongs
                                  where r.Id == id
                                    && r.CreatedBy == uid
                                  select r).FirstOrDefault();
                if(songrequest == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "not found id request song"
                    });
                }
                else
                {
                    songrequest.Status = 1;
                    context.SaveChanges();
                    return Ok(new
                    {
                        success = true,
                        message = "successful!",
                        data = songrequest,
                    });
                }
            }
        }

        [HttpPut("song/moveDraft")]
        public IActionResult MOveDraft(int id)
        {
            int uid = User.Identity.GetId();
            using (var context = new MusicContext())
            {
                var songrequest = (from r in context.Requestsongs
                                   where r.Id == id
                                        && r.CreatedBy == uid
                                   select r).FirstOrDefault();
                if (songrequest == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "not found id request song"
                    });
                }
                else
                {
                    songrequest.Status = 0;
                    context.SaveChanges();
                    return Ok(new
                    {
                        success = true,
                        message = "successful!",
                        data = songrequest,
                    });
                }
            }
        }

        [HttpDelete("song/deletedraft")]
        public IActionResult DeleteDraft(int id)
        {
            int uid = User.Identity.GetId();
            using (var context = new MusicContext())
            {
                var songrequest = (from r in context.Requestsongs
                                   where r.Id == id
                                        && r.CreatedBy == uid
                                   select r).FirstOrDefault();
                if (songrequest == null)
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
                    var folderName = Path.Combine("Uploads", "Songs", songrequest.Src);
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    FileInfo file = new FileInfo(pathToSave);
                    if (file.Exists)
                    {
                        file.Delete();
                    }
                    // delete file song image
                    folderName = Path.Combine("Uploads", "Images", "Songs", songrequest.Img);
                    pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    FileInfo file1 = new FileInfo(pathToSave);
                    if (file1.Exists)
                    {
                        file1.Delete();
                    }
                    context.Requestsongs.Remove(songrequest);
                    context.SaveChanges();
                    return Ok(new
                    {
                        success = true,
                        message = "successful!",
                    });
                }
            }
        }

        [HttpDelete("song/delete")]
        public IActionResult DeleteDSong(int id)
        {
            int uid = User.Identity.GetId();
            using (var context = new MusicContext())
            {
                var song = (from r in context.Songs
                                   where r.Id == id
                                        && r.CreatedBy == uid
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
                    context.Songs.Remove(song);
                    context.SaveChanges();
                    return Ok(new
                    {
                        success = true,
                        message = "successful!",
                    });
                }
            }
        }

        [HttpPut("song/update"), DisableRequestSizeLimit]
        public async Task<IActionResult> UpdateDraftSong()
        {
            int uid = User.Identity.GetId();
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

                //if(changeImg.Equals("true"))
                //    System.Diagnostics.Debug.WriteLine("true");
                //else
                //System.Diagnostics.Debug.WriteLine("false");

                using (var context = new MusicContext())
                {
                    var check = (from r in context.Songs
                                 where r.Tag == tag
                                 select r).FirstOrDefault();
                    var check1 = (from r in context.Requestsongs
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
                    var song = (from r in context.Requestsongs
                                where r.Id == id
                                    && r.CreatedBy == uid
                                    && r.Status == 0
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
                    if(album != -1)
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
                        if(localSrc == 1)
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
                        if(localImg == 1)
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
                        if(localSrc == 1)
                        {
                            upload = new UploadSong();
                            song.Src = upload.UploadFile(files[1]);
                        }
                        else
                        {
                            song.Src = formCollection["src"][0].ToString().Trim();
                        }
                    }
                    if (context.SaveChanges() > 0)
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

            }
            catch (Exception e)
            {
                return StatusCode(500, "Internal server error " + e);
            }
        }

        [HttpPost("song/create"), DisableRequestSizeLimit]
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
                var status = Int32.Parse(formCollection["status"][0]);
                var localImg = Int32.Parse(formCollection["localimg"][0]);
                var localSrc = Int32.Parse(formCollection["localsrc"][0]);

                //if (files.Any(f => f.Length < 2))
                //{
                //    return Ok(new
                //    {
                //        success = false,
                //        message = "Not enough file!"
                //    });
                //}

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

                if (localImg == 0 && localSrc == 0)
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
            }
            catch (Exception e)
            {
                return StatusCode(500, "Internal server error " + e);
            }
        }

        //Album
        [HttpGet("album/getalbum")]
        public IActionResult GetAlbum(int page, int limit)
        {
            int id = User.Identity.GetId();
            if (page < 1)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Page start from 1",
                });
            }
            using (var context = new MusicContext())
            {
                var album = from r in context.Albums
                           where r.CreatedBy == id
                           select new
                           {
                               
                              r.Id,
                              r.Name,
                              r.Artist,
                              r.Tag,
                              r.Img,
                              r.Show,
                              r.CreatedAt,
                              r.LocalImg,
                           };
                int p = page - 1;
                return Ok(new
                {
                    length = album.Count(),
                    album = album.Skip(limit * p).Take(limit).ToList(),

                });
            }
        }
        [HttpPut("album/show")]
        public IActionResult ChangeShowAlbum(int id)
        {
            int uid = User.Identity.GetId();
            using (var context = new MusicContext())
            {
                var album = (from r in context.Albums
                            where r.CreatedBy == uid
                                 && r.Id == id
                            select r).FirstOrDefault();
                if (album == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not Found or Not permission"
                    });
                }
                else
                {
                    if (album.Show == 1)
                    {
                        var songs = from r in context.Songs
                                where r.Album == album.Id
                                select r;
                        album.Show = 0;
                        foreach(Song s in songs){
                            s.Show = 0;
                        }
                    }
                    else
                    {
                        album.Show = 1;
                    }

                    context.SaveChanges();
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
            }
        }

        [HttpDelete("album/delete")]
        public IActionResult DeleteAlbum(int id)
        {
            int uid = User.Identity.GetId();
            using (var context = new MusicContext())
            {
                var album = (from r in context.Albums
                                   where r.Id == id
                                        && r.CreatedBy == uid
                                   select r).FirstOrDefault();
                if (album == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "not found id album"
                    });
                }
                else
                {
                    // delete album image
                    var folderName = Path.Combine("Uploads", "Images", "Albums", album.Img);
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    FileInfo file = new FileInfo(pathToSave);
                    if (file.Exists)
                    {
                        file.Delete();
                    }

                    var songs = from r in context.Songs
                                where r.Album == id
                                    && r.CreatedBy == uid
                                select r;
                    foreach(var song in songs)
                    {
                        context.Songs.Remove(song);
                    }
                    context.Albums.Remove(album);
                    if(context.SaveChanges() > 0)
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
        }

        [HttpPost("album/create"), DisableRequestSizeLimit]
        public async Task<IActionResult> CreateAlbum()
        {
            try
            {
                var formCollection = await Request.ReadFormAsync();

                var files = formCollection.Files;
                var name = formCollection["name"][0].ToString().Trim();
                var artist = formCollection["artist"][0].ToString().Trim();
                var show = Int32.Parse(formCollection["show"][0]);
                var createBy = User.Identity.GetId();
                var localImg = Int32.Parse(formCollection["localimg"][0]);


                if (name.Length == 0 || artist.Length == 0)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not enough infomation!"
                    });
                }
                string image = null;
                if(localImg == 1)
                {
                    // file album image
                    UploadTemplate upload = new UploadImageAlbum();
                    image = upload.UploadFile(files[0]);
                }
                else
                {
                    image = formCollection["img"][0].ToString().Trim();
                }


                //create data
                using (var context = new MusicContext())
                {
                    context.Albums.Add(new Album()
                    {
                            Name = name,
                            Artist = artist,
                            Img = image,
                            Show = show,
                            LocalImg = localImg,
                            Tag = SongHelper.ConvertTag(name),
                            CreatedBy = createBy,
                    });

                    if(context.SaveChanges() > 0)
                    {
                        return Ok(new
                        {
                            success = true,
                            message = "Create success!"
                        });
                    }
                    else
                    {
                        return Ok(new
                        {
                            success = false,
                            message = "Create fail!"
                        });
                    }
                }            }
            catch (Exception e)
            {
                return StatusCode(500, "Internal server error " + e);
            }
        }

        [HttpPut("album/update"), DisableRequestSizeLimit]
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
                var createBy = User.Identity.GetId();
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

                using (var context = new MusicContext())
                {
                    var album = (from r in context.Albums
                                 where r.Id == id
                                     && r.CreatedBy == createBy
                                 select r).FirstOrDefault();

                    if(album == null)
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
                        var folderName = Path.Combine("Uploads", "Images", "Albums", album.Img);
                        var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                        FileInfo file = new FileInfo(pathToSave);
                        if (file.Exists)
                        {
                            file.Delete();
                        }
                        if(localImg == 1)
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

                    if (context.SaveChanges() > 0)
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
            }
            catch (Exception e)
            {
                return StatusCode(500, "Internal server error " + e);
            }
        }

    }
}
