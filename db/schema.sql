-- DROP DATABASE IF EXISTS employee_db;
-- CREATE DATABASE employee_db;
-- USE employee_db; 

-- CREATE TABLE department (
--     id INTEGER PRIMARY KEY AUTO_INCREMENT,
--     name VARCHAR(30) NOT NULL
-- );

-- CREATE TABLE role (
--     id INTEGER PRIMARY KEY AUTO_INCREMENT,
--     title VARCHAR(30) NOT NULL, 
--     salary DECIMAL NOT NULL,
--     department_id INTEGER, 
--     INDEX dep_ind (department_id),
--     CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
-- );

-- CREATE TABLE employee (
--     id INTEGER PRIMARY KEY AUTO_INCREMENT,
--     first_name VARCHAR(30) NOT NULL,
--     last_name VARCHAR(30) NOT NULL,
--     role_id INTEGER, 
--     INDEX role_ind (role_id),
--     CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
--     manager_id INTEGER,
--     INDEX manager_ind (manager_id),
--     CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
-- );

DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE departments(
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
name VARCHAR(30) NOT NULL);

CREATE TABLE roles(
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
title VARCHAR(30) NOT NULL,
salary DECIMAL(11,2) NOT NULL,
department_id INT NOT NULL,
FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL);

CREATE TABLE employees(
id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL);



