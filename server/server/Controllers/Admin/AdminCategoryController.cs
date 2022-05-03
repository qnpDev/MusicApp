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
    [Route("api/admin/category")]
    [ApiController]
    [Authorize(Roles = "10")]
    public class AdminCategoryController : ControllerBase
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
            var category = from r in db.Categories
                           select r;
            int p = page - 1;
            return Ok(new
            {
                size = category.Count(),
                data = category.Skip(limit * p).Take(limit).ToList(),
            });
        }

        [HttpDelete]
        public IActionResult Delete(int id)
        {

            var category = (from r in db.Categories
                         where r.Id == id
                         select r).FirstOrDefault();
            if (category == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "not found category"
                });
            }
            else
            {
                // delete album image
                DeleteFile delFile = new(new DeleteImageCategory());
                delFile.Delete(category.Avatar);

                var songs = from r in db.Songs
                            where r.Category == id
                            select r;
                foreach (var song in songs)
                {
                    db.Songs.Remove(song);
                }
                db.Categories.Remove(category);
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
                var tag = formCollection["tag"][0].ToString().Trim();
                var show = Int32.Parse(formCollection["show"][0]);
                var id = Int32.Parse(formCollection["id"][0]);
                var changeImg = formCollection["changeImage"][0].ToLower();
                var localImg = Int32.Parse(formCollection["localimg"][0]);



                if (name.Length == 0 || tag.Length == 0)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not enough infomation!"
                    });
                }

                var category = (from r in db.Categories
                                where r.Id == id
                             select r).FirstOrDefault();

                if (category == null)
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
                    DeleteFile delFile = new(new DeleteImageCategory());
                    delFile.Delete(category.Avatar);

                    if (localImg == 1)
                    {
                        // upload file song image
                        UploadTemplate upload = new UploadImageCategory();
                        category.Avatar = upload.UploadFile(files[0]);
                    }
                    else
                    {
                        category.Avatar = formCollection["img"][0].ToString().Trim();
                    }


                }

                category.Name = name;
                category.Show = show;
                category.UpdatedAt = DateTime.Now;
                category.Tag = tag;
                category.LocalAvatar = localImg;

                if (db.SaveChanges() > 0)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Update success!",
                        data = category,
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

        [HttpPut("show")]
        public IActionResult ChangeShow(int id)
        {
            var category = (from r in db.Categories
                         where r.Id == id
                         select r).FirstOrDefault();
            if (category == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Not Found"
                });
            }
            else
            {
                if (category.Show == 1)
                {
                    //var songs = from r in db.Songs
                    //            where r.Category == category.Id
                    //            select r;
                    category.Show = 0;
                    //foreach (Song s in songs)
                    //{
                    //    s.Show = 0;
                    //}
                }
                else
                {
                    category.Show = 1;
                }

                if (db.SaveChanges() > 0)
                {
                    return Ok(new
                    {
                        success = true,
                        data = category,
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

        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> Create()
        {
            try
            {
                var formCollection = await Request.ReadFormAsync();

                var files = formCollection.Files;
                var name = formCollection["name"][0].ToString().Trim();
                var tag = formCollection["tag"][0].ToString().Trim().ToLower().Replace(" ", "");
                var show = Int32.Parse(formCollection["show"][0]);
                var createBy = User.Identity.GetId();
                var localImg = Int32.Parse(formCollection["localimg"][0]);


                if (name.Length == 0 || tag.Length == 0)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not enough infomation!"
                    });
                }
                var check = (from r in db.Categories
                             where r.Tag == tag
                             select r).FirstOrDefault();
                if(check != null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Tag already exists!",
                    });
                }

                string image = null;
                if (localImg == 1)
                {
                    // file category image
                    UploadTemplate upload = new UploadImageCategory();
                    image = upload.UploadFile(files[0]);
                }
                else
                {
                    image = formCollection["img"][0].ToString().Trim();
                }


                //create data
                //var tag = SongHelper.ConvertTag(name);
                    db.Categories.Add(new Category()
                    {
                        Name = name,
                        Avatar = image,
                        Show = show,
                        LocalAvatar = localImg,
                        Tag = tag,
                        //CreatedBy = createBy,
                    });
                db.SaveChanges();
                var getInf = (from r in db.Categories
                              where r.Tag == tag
                              select r).FirstOrDefault();

                    if (getInf != null)
                    {
                        return Ok(new
                        {
                            success = true,
                            message = "Create success!",
                            data = getInf,
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
            }
            catch (Exception e)
            {
                return StatusCode(500, "Internal server error " + e);
            }
        }
    }
}
