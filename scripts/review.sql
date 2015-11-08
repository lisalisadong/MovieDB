-- REVIEW (user_id:string, movie_id:int, star:int, comment:string, timeCreated:timestamp)
create table review(
	user_id varchar(50), 
    movie_id integer,
    star integer,
    comment varchar(10000),
    timeCreated timestamp,
    primary key (user_id, movie_id),
    foreign key (user_id) references user(id),
    foreign key (movie_id) references movie(id))