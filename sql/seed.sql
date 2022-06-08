USE employeesDB;

INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Design");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Designer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Amy", "Dunne", 1, 3);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Tonya", "Harding", 2, 1);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Lizbeth", "Salander", 3, null);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Walter", "White", 4, 3);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Rick", "Deckard", 5, null);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Jack", "Napier", 2, null);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Paul", "Allen", 4, 7);
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Patrick", "Bateman", 1, 2);