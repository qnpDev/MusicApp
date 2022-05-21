using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers.Admin
{
    [Route("api/admin/database")]
    [ApiController]
    public class AdminDatabase : ControllerBase
    {
        MusicContext db = new();

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), Path.Combine("Uploads", "Database"));
                DirectoryInfo d = new DirectoryInfo(folder);
                FileInfo[] files = d.GetFiles();

                List<string> list = new();
                foreach (FileInfo file in files)
                {
                    list.Add(file.Name);
                }
                list.Reverse();
                return Ok(new
                {
                    success = true,
                    message = "Success!",
                    data = list.ToList(),
                });
            }
            catch
            {
                return Ok(new
                {
                    success = true,
                    message = "Have some problems!",
                });
            }
        }

        [HttpGet("file/{filename}")]
        public async Task<IActionResult> GetBackup(string filename)
        {
            if (System.IO.File.Exists("Uploads/Database/" + filename))
            {

                var bytes = await System.IO.File.ReadAllBytesAsync("Uploads/Database/" + filename);
                return File(bytes, "application/octet-stream", Path.GetFileName("Uploads/Database/" + filename));

            }
            else
            {
                return NotFound(new
                {
                    success = false,
                    message = "File not found"
                });
            }
        }

        [HttpPost("backup")]
        public async Task<IActionResult> Backup()
        {
            var conn = db.Database.GetDbConnection();
            string dbName = conn.Database;
            string folder = Path.Combine(Directory.GetCurrentDirectory(), Path.Combine("Uploads", "Database"));
            try
            {
                await conn.OpenAsync();
                string fileCurrent = DateTime.Now.ToString("ddMMyyyy_HHmmss");
                string sql = "backup database " + dbName + " to disk='" + folder + "\\" + fileCurrent + ".bak'";
                var command = conn.CreateCommand();
                command.CommandText = sql;
                var result = await command.ExecuteNonQueryAsync();
                if (result == -1)
                {
                    await conn.CloseAsync();
                    return Ok(new
                    {
                        success = true,
                        message = "Create success!",
                        data = fileCurrent + ".bak",
                        result,
                    });
                }
                else
                {
                    await conn.CloseAsync();
                    return Ok(new
                    {
                        success = false,
                        message = "Can not create data!",
                        result,
                    });
                }

            }
            catch
            {
                return Ok(new
                {
                    success = false,
                    message = "Can not access data!",
                });
            }
        }

        [HttpDelete]
        public IActionResult Delete(string name)
        {
            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), Path.Combine(Directory.GetCurrentDirectory(), Path.Combine("Uploads", "Database")));
            var fullPath = Path.Combine(pathToSave, name);
            FileInfo file = new(fullPath);
            if (file.Exists)
            {
                file.Delete();
            }
            return Ok(new
            {
                success = true,
                message = "Success!",
            });
        }
    }
}
