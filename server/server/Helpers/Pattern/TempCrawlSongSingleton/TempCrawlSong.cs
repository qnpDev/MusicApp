using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.TempCrawlSongSingleton
{
    public class TempCrawlSong
    {
        private static volatile TempCrawlSong instance;
        private static readonly object InstanceLoker = new();
            
        public static List<TempCrawlSongModel> list;
        private TempCrawlSong()
        {
            list = new();
        }
        public static TempCrawlSong GetInstance
        {
            get
            {
                if(instance == null)
                {
                    lock (InstanceLoker)
                    {
                        if(instance == null)
                        {
                            instance = new TempCrawlSong();
                        }
                    }
                }
                return instance;
            }
        }
    }
}
