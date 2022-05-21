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
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        MusicContext db = new();

        [HttpGet]
        public IActionResult Get(int id = 1)
        {
            var user = (from r in db.Users
                       where r.Id == id
                        select new
                       {
                           r.Id,
                           r.Name,
                           r.Avatar,
                           r.Email,
                           r.Roles,
                           r.CreatedAt,
                           r.LocalAvatar,
                           r.Username,
                           songCount = r.Songs.Count(x => x.Show == 1),
                           albumCount = r.Albums.Count(x => x.Show == 1),
                       }).FirstOrDefault();
            if(user != null)
            {
                return Ok(new
                {
                    success = true,
                    message = "successful!",
                    data = user,
                });
            }
            else
            {
                return Ok(new
                {
                    success = false,
                    message = "Can not found user!",
                });
            }
        }

        [HttpGet("song")]
        public IActionResult GetSong(int id = 1, int page = 1, int limit = 6)
        {
            var data = from r in db.Songs
                       where r.Show == 1
                           && r.CreatedBy == id
                       orderby r.CreatedAt descending
                       select new
                       {
                           r.Id,
                           r.Name,
                           r.Artist,
                           r.Img,
                           r.Listen,
                           r.LocalImg,
                           r.CreatedAt,
                           r.Tag,
                           category = r.CategoryNavigation.Name,
                           album = r.AlbumNavigation.Name,
                       };
            int p = page - 1;
            return Ok(new
            {
                size = data.Count(),
                data = data.ToList().Skip(limit * p).Take(limit),
            });
        }

        [HttpGet("album")]
        public IActionResult GetAlbum(int id = 1, int page = 1, int limit = 6)
        {
            var data = from r in db.Albums
                       where r.Show == 1
                           && r.CreatedBy == id
                       orderby r.CreatedAt descending
                       select new
                       {
                           r.Id,
                           r.Name,
                           r.Artist,
                           r.Img,
                           r.LocalImg,
                           r.CreatedAt,
                           r.Tag,
                           songCount = r.Songs.Count(x => x.Show == 1),
                       };
            int p = page - 1;
            return Ok(new
            {
                size = data.Count(),
                data = data.ToList().Skip(limit * p).Take(limit),
            });
        }


        [HttpPut, DisableRequestSizeLimit]
        [Authorize]
        public async Task<IActionResult> Update()
        {
            try
            {
                var formCollection = await Request.ReadFormAsync();

                var files = formCollection.Files;
                var name = formCollection["name"][0].ToString().Trim();
                var email = formCollection["email"][0].ToString().Trim();
                //var id = Int32.Parse(formCollection["id"][0]);
                var id = User.Identity.GetId();
                var changeImg = formCollection["changeImage"][0].ToLower();
                var localImg = Int32.Parse(formCollection["localimg"][0]);

                if (name.Length == 0 || email.Length == 0)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not enough infomation!"
                    });
                }

                var data = (from r in db.Users
                            where r.Id == id
                            select r).FirstOrDefault();

                if (data == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Can not find user",
                    });
                }

                var checkEmail = (from r in db.Users
                                  where r.Email == email
                                    && r.Id != data.Id
                                  select r).FirstOrDefault();
                if (checkEmail != null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Email already exists!"
                    });
                }

                if (changeImg.Equals("true"))
                {
                    // delete file song image
                    DeleteFile delFile = new(new DeleteImageUser());
                    delFile.Delete(data.Avatar);

                    if (localImg == 1)
                    {
                        // upload file song image
                        UploadTemplate upload = new UploadImageUser();
                        data.Avatar = upload.UploadFile(files[0]);
                    }
                    else
                    {
                        data.Avatar = formCollection["img"][0].ToString().Trim();
                    }
                }

                data.Name = name;
                data.Email = email;
                data.LocalAvatar = localImg;
                data.UpdatedAt = DateTime.Now;

                if (db.SaveChanges() > 0)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Update success!",
                        data,
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
                return StatusCode(200, new
                {
                    success = false,
                    message = "Internal server error " + e,
                });
            }
        }

        [HttpPut("change-password"), DisableRequestSizeLimit]
        [Authorize]
        public async Task<IActionResult> UpdatePassword()
        {
            try
            {
                var formCollection = await Request.ReadFormAsync();

                var password = formCollection["password"][0].ToString().Trim();
                var oldPassword = formCollection["oldPassword"][0].ToString().Trim();
                if(oldPassword.Length < 4 || password.Length < 4)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Password must be greater than or equal to 4 characters",
                    });
                }

                var id = User.Identity.GetId();

                var data = (from r in db.Users
                            where r.Id == id
                            select r).FirstOrDefault();

                if (data == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Can not find user",
                    });
                }

                if (data.Password.Equals(UserHelper.encrypt(oldPassword)))
                {
                    data.Password = UserHelper.encrypt(password);
                }
                else
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Old password not match!",
                    });
                }
                if (db.SaveChanges() > 0)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Update success!",
                        data,
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
                return StatusCode(200, new
                {
                    success = false,
                    message = "Internal server error " + e,
                });
            }
        }
    }
}
