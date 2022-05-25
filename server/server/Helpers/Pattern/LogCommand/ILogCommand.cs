using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.LogCommand
{
    public interface ILogCommand
    {
        public void execute();
    }
}
