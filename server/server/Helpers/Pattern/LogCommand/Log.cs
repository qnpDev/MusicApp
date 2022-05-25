using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.LogCommand
{
    public class Log : ILogCommand
    {
        private ILogReceiver logReceiver;
        private String msg;
        public Log(ILogReceiver logReceiver, String msg)
        {
            this.logReceiver = logReceiver;
            this.msg = msg;
        }

        public void execute()
        {
            logReceiver.log(msg);
        }
    }
}
