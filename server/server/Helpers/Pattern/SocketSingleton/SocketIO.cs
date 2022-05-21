using SocketIOSharp.Server;
using SocketIOSharp.Server.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.SocketSingleton
{
    public class SocketIO
    {
        private static volatile SocketIO instance;
        private static readonly object InstanceLoker = new();

        private static SocketIOServer server;
        private SocketIO()
        {
            server = new SocketIOServer(new SocketIOServerOption(9001));
            server.Start();
            //server.OnConnection((SocketIOSocket socket) =>
            //{
            //    System.Diagnostics.Debug.WriteLine("connected");
            //});
        }
        public static SocketIO GetInstance
        {
            get
            {
                if (instance == null)
                {
                    lock (InstanceLoker)
                    {
                        if (instance == null)
                        {
                            instance = new SocketIO();
                        }
                    }
                }
                return instance;
            }
        }

        public void Stop()
        {
            server.Stop();
        }

        public SocketIOServer GetServer()
        {
            return server;
        }
    }
}
