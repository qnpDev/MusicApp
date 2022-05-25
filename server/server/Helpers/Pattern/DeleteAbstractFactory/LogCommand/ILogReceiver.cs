using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DeleteAbstractFactory.LogCommand
{
    public interface ILogReceiver
    {
        public void configure(bool enable);
        public void log(string msg);
    }
}
