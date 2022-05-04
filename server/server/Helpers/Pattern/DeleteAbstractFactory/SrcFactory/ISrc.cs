using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DeleteAbstractFactory.SrcFactory
{
    public interface ISrc
    {
        public void Delete(string fileName);
    }
}
