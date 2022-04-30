using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace server.Models
{
    public partial class MusicContext : DbContext
    {
        public MusicContext()
        {
        }

        public MusicContext(DbContextOptions<MusicContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Album> Albums { get; set; }
        public virtual DbSet<Banner> Banners { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<RefreshToken> RefreshTokens { get; set; }
        public virtual DbSet<Requestsong> Requestsongs { get; set; }
        public virtual DbSet<Song> Songs { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=LAPTOP-QNP\\QNP;Database=Music;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<Album>(entity =>
            {
                entity.ToTable("album");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Artist).HasColumnName("artist");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("createdAt")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.Img)
                    .IsUnicode(false)
                    .HasColumnName("img");

                entity.Property(e => e.LocalImg)
                    .HasColumnName("localImg")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name");

                entity.Property(e => e.Show).HasColumnName("show");

                entity.Property(e => e.Tag)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("tag");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("updatedAt")
                    .HasDefaultValueSql("((0))");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Albums)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK__album__createdBy__70DDC3D8");
            });

            modelBuilder.Entity<Banner>(entity =>
            {
                entity.ToTable("banner");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.ColorInfo)
                    .IsUnicode(false)
                    .HasColumnName("colorInfo")
                    .HasDefaultValueSql("('white')");

                entity.Property(e => e.ColorTitle)
                    .IsUnicode(false)
                    .HasColumnName("colorTitle")
                    .HasDefaultValueSql("('white')");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("createdAt")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Img)
                    .IsRequired()
                    .HasColumnName("img");

                entity.Property(e => e.Info)
                    .HasColumnType("ntext")
                    .HasColumnName("info");

                entity.Property(e => e.Link)
                    .IsUnicode(false)
                    .HasColumnName("link");

                entity.Property(e => e.LocalImg)
                    .HasColumnName("localImg")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.LocalLink)
                    .HasColumnName("localLink")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Name).HasColumnName("name");

                entity.Property(e => e.Show)
                    .HasColumnName("show")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("updatedAt")
                    .HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("categories");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Avatar)
                    .IsUnicode(false)
                    .HasColumnName("avatar");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("createdAt")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.LocalAvatar)
                    .HasColumnName("localAvatar")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name");

                entity.Property(e => e.Show)
                    .HasColumnName("show")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Tag)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("tag");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("updatedAt")
                    .HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(e => new { e.Id, e.UserId })
                    .HasName("PK__refreshT__DEAA49F0CEF3D545");

                entity.ToTable("refreshToken");

                entity.Property(e => e.Id)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("id");

                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("createdAt")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.ExpiredAt)
                    .HasColumnType("datetime")
                    .HasColumnName("expiredAt")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Token)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("token");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.RefreshTokens)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__refreshTo__userI__5441852A");
            });

            modelBuilder.Entity<Requestsong>(entity =>
            {
                entity.ToTable("requestsong");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Album).HasColumnName("album");

                entity.Property(e => e.Artist)
                    .IsRequired()
                    .HasColumnName("artist");

                entity.Property(e => e.Category).HasColumnName("category");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("createdAt")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.Img)
                    .IsUnicode(false)
                    .HasColumnName("img");

                entity.Property(e => e.LocalImg)
                    .HasColumnName("localImg")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.LocalSrc)
                    .HasColumnName("localSrc")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name");

                entity.Property(e => e.Show)
                    .HasColumnName("show")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Src)
                    .IsRequired()
                    .HasColumnName("src");

                entity.Property(e => e.Status).HasColumnName("status");

                entity.Property(e => e.Tag)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("tag");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("updatedAt")
                    .HasDefaultValueSql("((0))");

                entity.HasOne(d => d.AlbumNavigation)
                    .WithMany(p => p.Requestsongs)
                    .HasForeignKey(d => d.Album)
                    .HasConstraintName("FK__requestso__album__7E37BEF6");

                entity.HasOne(d => d.CategoryNavigation)
                    .WithMany(p => p.Requestsongs)
                    .HasForeignKey(d => d.Category)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__requestso__categ__02084FDA");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Requestsongs)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__requestso__creat__7F2BE32F");
            });

            modelBuilder.Entity<Song>(entity =>
            {
                entity.ToTable("song");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Album).HasColumnName("album");

                entity.Property(e => e.Artist)
                    .IsRequired()
                    .HasColumnName("artist");

                entity.Property(e => e.Category).HasColumnName("category");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("createdAt")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.CreatedBy).HasColumnName("createdBy");

                entity.Property(e => e.Img)
                    .IsUnicode(false)
                    .HasColumnName("img");

                entity.Property(e => e.Listen).HasColumnName("listen");

                entity.Property(e => e.LocalImg)
                    .HasColumnName("localImg")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.LocalSrc)
                    .HasColumnName("localSrc")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name");

                entity.Property(e => e.Show)
                    .HasColumnName("show")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Src)
                    .IsRequired()
                    .HasColumnName("src");

                entity.Property(e => e.Tag)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("tag");

                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("updatedAt")
                    .HasDefaultValueSql("((0))");

                entity.HasOne(d => d.AlbumNavigation)
                    .WithMany(p => p.Songs)
                    .HasForeignKey(d => d.Album)
                    .HasConstraintName("FK__song__album__05D8E0BE");

                entity.HasOne(d => d.CategoryNavigation)
                    .WithMany(p => p.Songs)
                    .HasForeignKey(d => d.Category)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__song__category__0A9D95DB");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Songs)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__song__createdBy__07C12930");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Avatar)
                    .IsUnicode(false)
                    .HasColumnName("avatar");

                entity.Property(e => e.Block).HasColumnName("block");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasColumnName("createdAt")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Email)
                    .IsUnicode(false)
                    .HasColumnName("email");

                entity.Property(e => e.Name).HasColumnName("name");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .IsUnicode(false)
                    .HasColumnName("password");

                entity.Property(e => e.Roles).HasColumnName("roles");

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("username");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
