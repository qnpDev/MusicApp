using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Helpers.Pattern.SongFilterDecorator
{
    public class SongFilterModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public string artist { get; set; }
        public string img { get; set; }
        public string src { get; set; }
        public long listen { get; set; }
        public int localImg { get; set; }
        public int localSrc { get; set; }
        public int createdBy { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime? updatedAt { get; set; }
        public string tag { get; set; }
        public int idCategory { get; set; }
        public string category { get; set; }
        public string user { get; set; }
        public string album { get; set; }
    }
}
