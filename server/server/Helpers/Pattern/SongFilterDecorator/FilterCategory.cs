using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.SongFilterDecorator
{
    public class FilterCategory : FilterDecorator
    {
        private int[] category;
        public FilterCategory(ISongFilter songFilter, int[] category) : base(songFilter)
        {
            this.category = category;
        }

        public override List<SongFilterModel> filter()
        {
            var data = from r in base.wrapper.filter()
                       where category.Contains(r.idCategory)
                       select r;
            return data.ToList();
        }
    }
}
