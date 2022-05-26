using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.SongFilterDecorator
{
    public abstract class FilterDecorator : ISongFilter
    {
        protected ISongFilter wrapper;

        protected FilterDecorator(ISongFilter songFilter)
        {
            this.wrapper = songFilter;
        }

        public override List<SongFilterModel> filter()
        {
            return wrapper.filter();
        }
    }
}
