-- ACTOR (id:int, name:string, dateOfBirth:date, picture:string)
create table actor(
	id bigint, 
    name varchar(50) not null, 
	dateOfBirth date, 
    picture varchar(100),
    bio varchar(500),
    primary key (id))