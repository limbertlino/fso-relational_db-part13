CREATE TABLE blogs (id SERIAL UNIQUE  PRIMARY KEY, 
  author text, 
  url text NOT NULL, 
  title text NOT NULL, 
  likes int DEFAULT 0);

insert into blogs (author, url, title, likes) values ('juan', 'www.juan.com', 'blog de juan', 1);
insert into blogs (author, url, title, likes) values ('maria', 'www.mariablog.com', 'blog de maria', 1);