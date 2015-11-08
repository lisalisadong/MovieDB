-- FriendWith (user_id1:string, user_id2:string, since:date)
create table friendWith(
	user_id1 varchar(50), 
    user_id2 varchar(50),
    since date,
    primary key (user_id1, user_id2),
    foreign key (user_id1) references user(id),
    foreign key (user_id2) references user(id))