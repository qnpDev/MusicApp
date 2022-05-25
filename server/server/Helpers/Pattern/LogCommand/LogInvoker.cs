using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.LogCommand
{
    public class LogInvoker
    {
        private ILogCommand command;

        public LogInvoker(ILogCommand command)
        {
            this.command = command;
        }

        public void execute()
        {
            command.execute();
        } 
    }
}
