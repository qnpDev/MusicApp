using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.LogCommand
{
    public class EnableLogCommand : ILogCommand
    {
        private ILogReceiver logReceiver;

        public EnableLogCommand(ILogReceiver logReceiver)
        {
            this.logReceiver = logReceiver;
        }

        public void execute()
        {
            logReceiver.configure(true);
        }
    }
}
