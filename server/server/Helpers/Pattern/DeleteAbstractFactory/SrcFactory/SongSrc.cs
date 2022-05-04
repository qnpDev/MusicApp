using server.Helpers.Pattern.DeleteStrategy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DeleteAbstractFactory.SrcFactory
{
    public class SongSrc : ISrc
    {
        public void Delete(string fileName)
        {
            DeleteFile delFile = new(new DeleteSong());
            delFile.Delete(fileName);
        }
    }
}
