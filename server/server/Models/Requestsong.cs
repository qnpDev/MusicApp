using System;
using System.Collections.Generic;

#nullable disable

namespace server.Models
{
    public partial class Requestsong
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Artist { get; set; }
        public string Img { get; set; }
        public string Src { get; set; }
        public int Category { get; set; }
        public string Tag { get; set; }
        public int Status { get; set; }
        public int? Album { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? Show { get; set; }
        public int? LocalImg { get; set; }
        public int? LocalSrc { get; set; }

        public virtual Album AlbumNavigation { get; set; }
        public virtual Category CategoryNavigation { get; set; }
        public virtual User CreatedByNavigation { get; set; }
    }
}
