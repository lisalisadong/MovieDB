-- Plays (actor_id:ind, movie_id:int, role: string
create table plays(
    actor_id int,
    movie_id int,
    role varchar(50),
    primary key (actor_id, movie_id, role),
    foreign key (actor_id) references actor(id),
    foreign key (movie_id) references movie(id))