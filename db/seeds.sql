USE company_db;

INSERT INTO departments(name)
VALUES('Sales'),
('Marketing'),
('HR');

INSERT INTO roles(title, salary, department_id)
VALUES('Sales Lead', 90894.47, 1),
('Associate Sales', 45486.00, 1),
('Senior Project Manager', 120372.65, 2),
('Associate Product Manger', 50900.5, 2),
('HR Manager', 93000.54, 3),
('Executive Assistant', 49583.55, 3);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES('David', 'Rose', 1, NULL),
('Patrick', 'Brewer', 2, 1),
('Stevie', 'Budd', 2, 1),
('Alexis', 'Rose', 3, NULL),
('Roland', 'Schitt', 4, 4),
('Jocelyn', 'Schitt', 4, 4),
('Moira', 'Rose', 5, NULL),
('Twyla', 'Sands', 6, 7),
('Ted', 'Mullens', 6, 7);