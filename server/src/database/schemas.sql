create table todoList (
  id varchar(32) unique primary key,
  title varchar(256) NOT NULL,
  description varchar(2048) NOT NULL,
  checklist JSON
);
