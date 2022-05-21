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
    [Route("api/admin/banner")]
    [ApiController]
    [Authorize(Roles = "10")]
    public class AdminBannerController : ControllerBase
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
            var category = from r in db.Banners
                           orderby r.CreatedAt descending
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

            var data = (from r in db.Banners
                            where r.Id == id
                            select r).FirstOrDefault();
            if (data == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "not found category"
                });
            }
            else
            {
                // delete album image
                DeleteFile delFile = new(new DeleteImageBanner());
                delFile.Delete(data.Img);

                db.Banners.Remove(data);
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
                var info = formCollection["info"][0].ToString().Trim();
                var link = formCollection["link"][0].ToString().Trim();
                var colorTitle = formCollection["colortitle"][0].ToString().Trim();
                var colorInfo = formCollection["colorinfo"][0].ToString().Trim();
                var show = Int32.Parse(formCollection["show"][0]);
                var id = Int32.Parse(formCollection["id"][0]);
                var changeImg = formCollection["changeImage"][0].ToLower();
                var localImg = Int32.Parse(formCollection["localimg"][0]);
                var localLink = Int32.Parse(formCollection["locallink"][0]);



                if (name.Length == 0)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not enough infomation!"
                    });
                }

                var data = (from r in db.Banners
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
                    DeleteFile delFile = new(new DeleteImageBanner());
                    delFile.Delete(data.Img);

                    if (localImg == 1)
                    {
                        // upload file song image
                        UploadTemplate upload = new UploadImageCategory();
                        data.Img = upload.UploadFile(files[0]);
                    }
                    else
                    {
                        data.Img = formCollection["img"][0].ToString().Trim();
                    }


                }

                data.Name = name;
                data.Info = info;
                data.LocalImg = localImg;
                data.LocalLink = localLink;
                data.Link = link;
                data.Show = show;
                data.UpdatedAt = DateTime.Now;
                data.ColorInfo = colorInfo;
                data.ColorTitle = colorTitle;

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
                return StatusCode(200, "Internal server error " + e);
            }
        }

        [HttpPut("show")]
        public IActionResult ChangeShow(int id)
        {
            var data = (from r in db.Banners
                            where r.Id == id
                            select r).FirstOrDefault();
            if (data == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Not Found"
                });
            }
            else
            {
                if (data.Show == 1)
                {
                    data.Show = 0;
                }
                else
                {
                    data.Show = 1;
                }

                if (db.SaveChanges() > 0)
                {
                    return Ok(new
                    {
                        success = true,
                        data,
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

                var id = User.Identity.GetId();
                var files = formCollection.Files;
                var name = formCollection["name"][0].ToString().Trim();
                var info = formCollection["info"][0].ToString().Trim();
                var link = formCollection["link"][0].ToString().Trim();
                var colorTitle = formCollection["colortitle"][0].ToString().Trim();
                var colorInfo = formCollection["colorinfo"][0].ToString().Trim();
                var show = Int32.Parse(formCollection["show"][0]);
                var localImg = Int32.Parse(formCollection["localimg"][0]);
                var localLink = Int32.Parse(formCollection["locallink"][0]);


                if (name.Length == 0 || link.Length == 0)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Not enough infomation!"
                    });
                }

                string image = null;
                if (localImg == 1)
                {
                    // file category image
                    UploadTemplate upload = new UploadImageBanner();
                    image = upload.UploadFile(files[0]);
                }
                else
                {
                    image = formCollection["img"][0].ToString().Trim();
                }


                //create data
                db.Banners.Add(new Banner()
                {
                    Name = name,
                    Info = info,
                    Link = link,
                    Img = image,
                    LocalImg = localImg,
                    LocalLink = localLink,
                    ColorInfo = colorInfo,
                    ColorTitle = colorTitle,
                    Show = show,
                    CreatedBy = id,
                });
                var checkSave = db.SaveChanges();
                var save = (from r in db.Banners
                            where r.Name == name
                                 && r.Link == link
                                 && r.Img == image
                                 && r.CreatedAt >= DateTime.Now.Date.AddDays(-1)
                            select r).FirstOrDefault();

                if (checkSave > 0)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Create success!",
                        data = save,
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
            catch (Exception)
            {
                return StatusCode(200, new 
                { 
                    status = false,
                    message = "Not enought infomation",
                });
            }
        }
    }
}
