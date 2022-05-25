using server.Helpers.Pattern.DeleteAbstractFactory.ImageFactory;
using server.Helpers.Pattern.DeleteAbstractFactory.SrcFactory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DeleteAbstractFactory
{
    public class DeleteAlbumFactory : DeleteAbstract
    {
        public override IImage DeleteImage()
        {
            return new AlbumImage();
        }

        public override ISrc DeleteSrc()
        {
            return new AlbumSrc();
        }
    }
}
