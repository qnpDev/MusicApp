using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Helpers;
using server.Helpers.Pattern.ChatSingleton;
using server.Helpers.Pattern.SocketSingleton;
using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        Chat db = Chat.GetInstance;
        MusicContext context = new();
        SocketIO socket = SocketIO.GetInstance;

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(db.GetList().ToList());
        }

        public class ChatCreateModel
        {
            public string msg { get; set; }
        }
        [HttpPost]
        public IActionResult Create([FromBody] ChatCreateModel data)
        {
            if(data == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Input data",
                });
            }
            if (data.msg == null || data.msg.Trim().Length == 0)
            {
                return Ok(new
                {
                    success = false,
                    message = "Input message",
                });
            }
            int uid = User.Identity.GetId();

            var user = (from r in context.Users
                        where r.Id == uid
                        select r).FirstOrDefault();

            var save = new ChatModel()
            {
                id = Guid.NewGuid().ToString("N"),
                uid = user.Id,
                name = user.Name,
                avatar = user.Avatar,
                localAvatar = user.LocalAvatar,
                msg = data.msg,
            };
            db.GetList().Add(save);
            socket.GetServer().Emit("chatAdd", save);
            return Ok(new
            {
                success = true,
                message = "Success!",
                data = save,
            });
        }

        [HttpDelete]
        public IActionResult Delete(string id)
        {
            if (id == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Input data",
                });
            }

            var temp = (from r in db.GetList()
                        where r.id == id
                        select r).FirstOrDefault();

            db.GetList().Remove(temp);
            socket.GetServer().Emit("chatRemove", id);
            return Ok(new
            {
                success = true,
                message = "Success!",
                data = id,
            });
        }

        [HttpDelete("clear")]
        [Authorize(Roles = "10")]
        public IActionResult Clear()
        {
            db.GetList().Clear();
            socket.GetServer().Emit("chatClear");
            return Ok(new
            {
                success = true,
                message = "Success!",
            });
        }
    }
}
