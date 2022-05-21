create Music
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

/*
alter table album
add localImg int default 0 not null

alter table banner
add localLink int default 0 not null
*/

create table categories(
	id int not null IDENTITY(1, 1),
	name nvarchar(MAX) not null,
	avatar varchar(MAX) not null,
	tag varchar(max) not null,
	show int default 0 not null,
	localAvatar int default 1 not null,
	createdAt datetime not null default current_timestamp,
	updatedAt datetime default 0,
	primary key(id, tag)
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
	primary key(id, tag),
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

/*
alter table banner
alter column createdBy int not null foreign key references users(id)

alter table banner
add colorTitle varchar(max) default 'white'

alter table banner
add colorInfo varchar(max) default 'white'

alter table banner
drop column colorTitle
alter table banner
drop column colorInfo
*/

create table refreshToken(
	id int not null identity(1,1),
	userId int not null foreign key references users(id),
	token varchar(max) not null,
	createdAt datetime not null default current_timestamp,
	expiredAt datetime not null default 0,
	primary key (id, userId)
)

/*
create table resetPassword(
	id int not null identity(1,1),
	token varchar(max) not null,
	primary key (id)
)
*/

create table album(
	id int not null identity(1,1),
	name nvarchar(max) not null,
	artist nvarchar(max),
	img varchar(max),
	localImg int default 1 not null,
	show int not null default 0 not null,
	tag varchar(max) not null,
	createdBy int foreign key references users(id),
	createdAt datetime not null default current_timestamp,
	updatedAt datetime not null default 0,
	primary key(id, tag)
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
	primary key(id, tag),
	foreign key (category) REFERENCES categories(id)
)
