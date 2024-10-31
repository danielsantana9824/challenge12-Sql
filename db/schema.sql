drop database if exists employeeBd;

create database employeeBd;


DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employee;

create table department(

id serial primary key,
name varchar(30) unique not null

);

create table roles(

id serial primary key,
title varchar(30) unique not null,
salary DECIMAL(10,2)  NOT NULL,
department_id INTEGER,
FOREIGN KEY(department_id) 
REFERENCES department(id)
ON DELETE SET NULL

);

create table employee(

id serial primary key,
first_name varchar(30) unique not null,
last_name varchar(30) unique not null,   

roles_id INTEGER NOT NULL,
FOREIGN KEY(roles_id ) 
REFERENCES roles(id)
ON DELETE SET NULL,

manager_id INTEGER,
FOREIGN KEY(manager_id ) 
REFERENCES employee(id)
ON DELETE SET NULL 

);