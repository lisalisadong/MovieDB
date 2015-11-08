-- Likes_Director (user_id:string, director_id:int)
create table likes_director(
	user_id varchar(50), 
    director_id int,
    primary key (user_id, director_id),
    foreign key (user_id) references user(id),
    foreign key (director_id) references director(id))