-- Directs (director_id:int, movie_id:int)
create table directs(
    director_id int,
    movie_id int,
    primary key (director_id, movie_id),
    foreign key (director_id) references director(id),
    foreign key (movie_id) references movie(id))