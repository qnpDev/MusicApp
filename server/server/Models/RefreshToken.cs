using System;
using System.Collections.Generic;

#nullable disable

namespace server.Models
{
    public partial class RefreshToken
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiredAt { get; set; }

        public virtual User User { get; set; }
    }
}
