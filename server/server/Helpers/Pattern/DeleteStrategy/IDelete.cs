using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DeleteStrategy
{
    public interface IDelete
    {
        public void Delete(string fileName);
    }
}
