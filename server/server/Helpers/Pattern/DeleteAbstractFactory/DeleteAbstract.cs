using server.Helpers.Pattern.DeleteAbstractFactory.ImageFactory;
using server.Helpers.Pattern.DeleteAbstractFactory.SrcFactory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DeleteAbstractFactory
{
    public abstract class DeleteAbstract
    {
        public abstract IImage DeleteImage();
        public abstract ISrc DeleteSrc();
    }
}
