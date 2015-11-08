-- Agrees (user_id1:string, user_id2:string, movie_id:int)
create table agrees(
	user_id1 varchar(50), 
    user_id2 varchar(50),
    movie_id integer,
    primary key (user_id1, user_id2, movie_id),
    foreign key (user_id1) references user(id),
    foreign key (user_id2) references user(id),
    foreign key (movie_id) references movie(id))