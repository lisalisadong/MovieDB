-- USER (id:string, username:string, password:string, dataCreated:date, avatar:binary)
create table user(
	id varchar(50), 
    username varchar(10) not null, 
	password varchar(20) not null, 
    dateCreated date, 
    avatar blob, 
    primary key (id))