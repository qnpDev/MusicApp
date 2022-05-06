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
    [Route("api/admin/user")]
    [ApiController]
    [Authorize(Roles = "10")]
    public class AdminUserController : ControllerBase
    {
        MusicContext db = new();

        [HttpGet]
        public IActionResult Get(int page, int limit)
        {
            if (page < 1)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Page start from 1",
                });
            }
            var data = from r in db.Users
                       orderby r.CreatedAt descending
                       select r;
            int p = page - 1;
            return Ok(new
            {
                size = data.Count(),
                data = data.Skip(limit * p).Take(limit).ToList(),
            });
        }

        [HttpGet("get-info")]
        public IActionResult GetInfo(int id)
        {
            var countSong = (from r in db.Songs
                       where r.CreatedBy == id
                       select r).Count();
            var countAlbum = (from r in db.Albums
                             where r.CreatedBy == id
                             select r).Count();
            var countRequest = (from r in db.Requestsongs
                             where r.CreatedBy == id
                             select r).Count();

            return Ok(new
            {
                success = true,
                message = "Success",
                data = new
                {
                    countSong,
                    countRequest,
                    countAlbum,
                }
            });
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {

            var data = (from r in db.Users
                        where r.Id == id
                        select r).FirstOrDefault();
            if (data == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "not found user"
                });
            }
            else
            {
                // delete album image
                DeleteFile delFile = new(new DeleteImageUser());
                delFile.Delete(data.Avatar);

                db.Users.Remove(data);
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
        public async Task<IActionResult> Update()
        {
            try
            {
                var formCollection = await Request.ReadFormAsync();

                var files = formCollection.Files;
                var name = formCollection["name"][0].ToString().Trim();
                var username = formCollection["username"][0].ToString().Trim();
                var changePassword = formCollection["changepassword"][0].ToLower();
                var email = formCollection["email"][0].ToString().Trim();
                var role = Int32.Parse(formCollection["role"][0]);
                var id = Int32.Parse(formCollection["id"][0]);
                var changeImg = formCollection["changeImage"][0].ToLower();
                var localImg = Int32.Parse(formCollection["localimg"][0]);



                if (name.Length == 0)
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
                        message = "Can not find category",
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
                if (changePassword.Equals("true"))
                {
                    data.Password = UserHelper.encrypt(formCollection["password"][0].ToString().Trim());
                }

                data.Name = name;
                data.Email = email;
                data.Username = username;
                data.LocalAvatar = localImg;
                data.Roles = role;
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
    }
}
