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
    });
}

