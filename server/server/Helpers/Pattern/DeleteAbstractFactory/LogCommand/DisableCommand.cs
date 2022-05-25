using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DeleteAbstractFactory.LogCommand
{
    public class DisableCommand : ILogCommand
    {
        private ILogReceiver logReceiver;

        public DisableCommand(ILogReceiver logReceiver)
        {
            this.logReceiver = logReceiver;
        }

        public void execute()
        {
            logReceiver.configure(true);
        }
    }
}
