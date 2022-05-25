using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.DeleteAbstractFactory
{
    public class DeleteFactory
    {
        private DeleteFactory() { }
        public static DeleteAbstract getFactory(DeleteType type)
        {
            switch (type)
            {
                case DeleteType.SONG:
                    return new DeleteSongFactory();
                case DeleteType.REQUESTSONG:
                    return new DeleteRequestSongFactory();
                case DeleteType.ALBUM:
                    return new DeleteAlbumFactory();
                default:
                    throw new ArgumentException("This type is unsupported");
            }
        }
    }
}
