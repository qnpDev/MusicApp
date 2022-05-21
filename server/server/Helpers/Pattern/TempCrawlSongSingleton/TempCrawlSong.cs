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
        public TempCrawlSongModel Get(string id)
        {
            var item = (from r in list
                        where r.id.Equals(id)
                        select r).FirstOrDefault();
            return item;
        }
        public List<TempCrawlSongModel> GetAll()
        {
            return list;
        }
        public void Add(TempCrawlSongModel data)
        {
            list.Add(data);
        }
        public void AddList(List<TempCrawlSongModel> data)
        {
            list.AddRange(data);
        }
        public void Remove(string id)
        {
            var item = (from r in list
                       where r.id.Equals(id)
                       select r).FirstOrDefault();
            list.Remove(item);
        }
        public void Clear()
        {
            list.Clear();
        }
        public int GetSize()
        {
            return list.Count();
        }
    }
}
