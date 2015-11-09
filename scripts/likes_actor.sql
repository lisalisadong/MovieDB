-- Likes_Actor (user_id:string, actor_id:int)
create table likes_actor(
	user_id varchar(50), 
    actor_id bigint,
    primary key (user_id, actor_id),
    foreign key (user_id) references user(id),
    foreign key (actor_id) references actor(id))