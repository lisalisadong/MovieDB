-- MOVIE (id:int, name:string, releaseDate:date, duration:int, poster:string)
create table movie(
	id integer, 
    name varchar(50) not null, 
    releaseDate date,
    duration int,
	poster varchar(100),
    overview varchar(500),
    primary key (id))