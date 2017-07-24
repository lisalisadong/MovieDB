# [Rin Movie-Lover Social Network](http://ec2-52-91-175-222.compute-1.amazonaws.com:3000/)

> Framework: NodeJS

**Introduction and Motivation** 
> Our application is a web social network application based on TMDB database. It can realize most of functions of TMDB community – that is, to search and to display information of a movie, an actor, or a director. Additionally, you can login with your Facebook account, follow other people’s timeline, and get to know which movie they have seen or want to see.

> The number of movie fans is so large. Thus a lot of websites holding information of movies, including names, genres, overviews or released dates, are attractive to movie fans. Meanwhile, because of social network needs, a combination of social network and movie info website is especially popular. We build a platform that can both keep track of movies you want to see or have seen and make friends with others by following and sharing comments on a specific movie. Integrating movie features and social network features is crucial for this project.

**Directories**
- scripts: SQL scripts we used to create or modify our tables.
- insertions: Java scripts we used to populate our database (from TMDB json files to AWS RDS).
- rin_nodejs: NodeJS project that contains the frontend and backend of our website.

**Building Instructions**
- [x] cd rin_nodejs
- [x] npm install → install required modules
- [x] npm start → launch the app listening on port 3000

**Modules:**
- [x] homepage module (homepage.js, homepage,ejs): rendering homepage, recommendation
- [x] movie module (movie.js, movie.ejs): retrieving and rendering movie information, commenting and marking movies
- [x] person module (person.js, person.ejs): retrieving and rendering actor/director information, liking actor/director
- [x] profile module (profile.js, profile.ejs): retrieving and rendering user profile (avatar, friends list, liked movies, liked actors/directors), following users
- [x] route module (routes.js): dispatch HTTP requests based on urls
- [x] search module (search.js, search.ejs): searching movies, actors, directors, and users
- [x] signup/signin module (passport.js, signup.ejs, login.ejs, connect-local.ejs, account.ejs): signup, signin

**References:**
- [Facebook login tutorial](https://scotch.io/tutorials/easy-node-authentication-facebook)
- [Bootstrap](http://getbootstrap.com/)

Screenshots, details and demo are available [here](https://lisalisadong.github.io/).
