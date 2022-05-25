using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DeleteAbstractFactory.LogCommand
{
    public class LogConsole : ILogReceiver
    {
        private bool isEnabled = true;

        public void configure(bool enable)
        {
            this.isEnabled = enable;
        }

        public void log(string msg)
        {
            if (isEnabled)
            {
                System.Diagnostics.Debug.WriteLine(msg + " - " + DateTime.Now.ToString());
            }
        }
    }
}
