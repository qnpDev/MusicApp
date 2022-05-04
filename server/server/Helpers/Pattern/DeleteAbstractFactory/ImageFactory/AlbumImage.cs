using server.Helpers.Pattern.DeleteStrategy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DeleteAbstractFactory.ImageFactory
{
    public class AlbumImage : IImage
    {
        public void Delete(string fileName)
        {
            DeleteFile delFile = new(new DeleteImageAlbum());
            delFile.Delete(fileName);
        }
    }
}
