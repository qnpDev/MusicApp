﻿using System;
using System.Collections.Generic;

#nullable disable

namespace server.Models
{
    public partial class User
    {
        public User()
        {
            Albums = new HashSet<Album>();
            Banners = new HashSet<Banner>();
            RefreshTokens = new HashSet<RefreshToken>();
            Requestsongs = new HashSet<Requestsong>();
            Songs = new HashSet<Song>();
        }

        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int Roles { get; set; }
        public string Name { get; set; }
        public string Avatar { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Email { get; set; }
        public int LocalAvatar { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int Ban { get; set; }

        public virtual ICollection<Album> Albums { get; set; }
        public virtual ICollection<Banner> Banners { get; set; }
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
        public virtual ICollection<Requestsong> Requestsongs { get; set; }
        public virtual ICollection<Song> Songs { get; set; }
    }
}
