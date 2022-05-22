using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.ChatSingleton
{
    public class Chat
    {
        private static volatile Chat instance;
        private static readonly object InstanceLoker = new();

        private static List<ChatModel> list;
        private Chat()
        {
            list = new();
        }
        public static Chat GetInstance
        {
            get
            {
                if (instance == null)
                {
                    lock (InstanceLoker)
                    {
                        if (instance == null)
                        {
                            instance = new Chat();
                        }
                    }
                }
                return instance;
            }
        }

        public List<ChatModel> GetList()
        {
            return list;
        }
    }
}
