create database Music
use Music

create table users(
	id int not null IDENTITY(1, 1),
	username varchar(50) not null,
	password varchar(100) not null,
	roles int default 0 not null,
	name nvarchar(MAX) not null,
	avatar varchar(MAX),
	localAvatar int default 0 not null,
	email varchar(MAX),
	createdAt datetime not null default current_timestamp,
	updatedAt datetime default 0,
	primary key(id)
)

create table album(
	id int not null identity(1,1),
	name nvarchar(max) not null,
	artist nvarchar(max),
	img varchar(max),
	localImg int default 1 not null,
	show int not null default 0,
	tag varchar(max) not null,
	createdBy int foreign key references users(id),
	createdAt datetime not null default current_timestamp,
	updatedAt datetime not null default 0,
	primary key(id)
)


create table categories(
	id int not null IDENTITY(1, 1),
	name nvarchar(MAX) not null,
	avatar varchar(MAX) not null,
	tag varchar(max) not null,
	show int default 0 not null,
	localAvatar int default 1 not null,
	createdAt datetime not null default current_timestamp,
	updatedAt datetime default 0,
	primary key(id)
)

create table song(
	id int not null identity(1,1),
	name nvarchar(max) not null,
	artist nvarchar(max) not null,
	img varchar(max) not null,
	src nvarchar(max) not null,
	category int not null,
	tag varchar(max) not null,
	show int default 0 not null,
	localImg int default 1 not null,
	localSrc int default 1 not null,
	album int foreign key references album(id),
	listen bigint not null default 0,
	createdBy int not null foreign key references users(id),
	createdAt datetime not null default current_timestamp,
	updatedAt datetime default 0,
	primary key(id),
	foreign key (category) REFERENCES categories(id)
)

create table banner(
	id int not null identity(1,1),
	name nvarchar(max),
	info ntext,
	colorTitle varchar(max) default 'white',
	colorInfo varchar(max) default 'white',
	img nvarchar(max) not null,
	link varchar(max),
	localImg int default 1 not null,
	localLink int default 1 not null,
	show int default 0 not null,
	createdBy int not null foreign key references users(id),
	createdAt datetime not null default current_timestamp,
	updatedAt datetime default 0,
	primary key(id),
)

create table refreshToken(
	id int not null identity(1,1),
	userId int not null foreign key references users(id),
	token varchar(max) not null,
	createdAt datetime not null default current_timestamp,
	expiredAt datetime not null default 0,
	primary key (id)
)

create table requestsong(
	id int not null identity(1,1),
	name nvarchar(max) not null,
	artist nvarchar(max) not null,
	img varchar(max),
	src nvarchar(max) not null,
	category int not null,
	tag varchar(max) not null,
	status int not null default 0,
	show int default 0 not null,
	localImg int default 1 not null,
	localSrc int default 1 not null,
	album int foreign key references album(id),
	createdBy int not null foreign key references users(id),
	createdAt datetime not null default current_timestamp,
	updatedAt datetime default 0,
	primary key(id),
	foreign key (category) REFERENCES categories(id)
)

/* admin user */
insert into users (username, password, roles, name, avatar, email, localAvatar) 
values ('qnp', '81dc9bdb52d04dc20036dbd8313ed055', 10, 'admin', 'default-avatar-music.jpg', 'qnpdev@gmail.com', 1)
