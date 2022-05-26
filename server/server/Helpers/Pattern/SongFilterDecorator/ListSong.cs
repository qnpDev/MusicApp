using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.SongFilterDecorator
{
    public class ListSong : ISongFilter
    {
        public override List<SongFilterModel> filter()
        {
            using(var db = new MusicContext())
            {
                var data = from r in db.Songs
                           where r.Show == 1
                           orderby r.CreatedAt descending
                           select new SongFilterModel()
                           {
                               id = r.Id,
                               name = r.Name,
                               artist = r.Artist,
                               img = r.Img,
                               listen = r.Listen,
                               localImg = r.LocalImg,
                               createdAt = r.CreatedAt,
                               createdBy = r.CreatedBy,
                               tag = r.Tag,
                               category = r.CategoryNavigation.Name,
                               user = r.CreatedByNavigation.Name,
                               album = r.AlbumNavigation.Name,
                               localSrc = r.LocalSrc,
                               src = r.Src,
                               updatedAt = r.UpdatedAt,
                               idCategory = r.Category,
                           };
                return data.ToList();
            }
        }
    }
}
