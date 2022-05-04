using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DeleteAbstractFactory.ImageFactory
{
    public interface IImage
    {
        public void Delete(string fileName);
    }
}
