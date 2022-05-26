using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.SongFilterDecorator
{
    public abstract class ISongFilter
    {
        public abstract List<SongFilterModel> filter();
    }
}
