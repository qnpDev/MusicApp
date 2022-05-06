using System;
using System.Collections.Generic;

#nullable disable

namespace server.Models
{
    public partial class Banner
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Info { get; set; }
        public string Img { get; set; }
        public string Link { get; set; }
        public int? Show { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string ColorTitle { get; set; }
        public string ColorInfo { get; set; }
        public int LocalImg { get; set; }
        public int LocalLink { get; set; }
    }
}
