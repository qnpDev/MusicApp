using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.ChatSingleton
{
    public class ChatModel
    {
        public string id { get; set; } = Guid.NewGuid().ToString("N");
        public int uid { get; set; }
        public string name { get; set; }
        public string avatar { get; set; }
        public int localAvatar { get; set; }
        public string msg { get; set; }
    }
}
