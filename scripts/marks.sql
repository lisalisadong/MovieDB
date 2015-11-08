-- Marks (user_id:string, movie_id:int, status:boolean)
create table marks(
	user_id varchar(50), 
    movie_id int,
    status boolean, -- watched: 1, to watch: 0
    primary key (user_id, movie_id),
    foreign key (user_id) references user(id),
    foreign key (movie_id) references movie(id))