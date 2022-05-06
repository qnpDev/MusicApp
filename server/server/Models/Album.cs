using System;
using System.Collections.Generic;

#nullable disable

namespace server.Models
{
    public partial class Album
    {
        public Album()
        {
            Requestsongs = new HashSet<Requestsong>();
            Songs = new HashSet<Song>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Artist { get; set; }
        public string Img { get; set; }
        public int Show { get; set; }
        public string Tag { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int LocalImg { get; set; }

        public virtual User CreatedByNavigation { get; set; }
        public virtual ICollection<Requestsong> Requestsongs { get; set; }
        public virtual ICollection<Song> Songs { get; set; }
    }
}
