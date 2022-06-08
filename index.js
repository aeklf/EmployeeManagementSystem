const mysql = require("mysql");
const inquirer = require("inquirer");
const { use } = require("express/lib/application");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "employeesDB"
});

connection.connect(function (err){
    if (err) throw err;
    firstPrompt ();
});

function firstPrompt() {
    inquirer
        .prompt({
            type: "list",
            name: "task",
            message: "What would you like to do?",
            choices: [
                "View Employees",
                "View Employees by Deparment",
                "Add Employee",
                "Remove Employee",
                "Update Employee",
                "Add Role",
                "End"
            ]
        })
    .then(function({ task }) {
        switch (task) {
            case "View Employees":
              viewEmployee();
              break;
            case "View Employees by Department":
              viewEmployeeByDepartment();
              break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Employee":
                updateEmployee();
                break;
            case "Add Role":
                addRole();
            break;
            case "End":
                connection.end();
                break;
        }
    });
}

function viewEmployee() {
    console.log("Viewing Employees\n");

    var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
	ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
	ON m.id = e.manager_id`

    connection.query(query, function (err, res){
        if (err) throw err;

        console.table(res);
        console.log("Employees viewed!\n");

        firstPrompt();
    });
}

function viewEmployeeByDepartment() {
    console.log("Viewing employees by department\n");

    var query =
        `SELECT d.id, d.name, r.salary AS budget
        FROM employee e
        LEFT JOIN role r
            ON e.role_id = r.id
        LEFT JOIN department d
        ON d.id = r.department_id
        GROUP BY d.id, d.name`

    connection.query(query, function (err, res){
        if (err) throw err;

        const departmentChoices = res.map(data=> ({
            value: data.id, name: data.name
        }));

        console.table(res);
        console.log("Deparment view successful!\n");

        promptDepartment(departmentChoices);
    });
}

