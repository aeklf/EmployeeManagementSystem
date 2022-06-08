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

function promptDepartment(departmentChoices) {
    inquirer
        .prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Choose a department:",
                choices: departmentChoices
            }
        ])
        .then(function (answer){
            console.log(" answer ", answer.departmentId);

            var query =
            `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
            FROM employee e
            JOIN role r
              ON e.role_id = r.id
            JOIN department d
            ON d.id = r.department_id
            WHERE d.id = ?`

            connection.query(query, answer.departmentId, function (err, res){
                if (err) throw err;

                console.table("response", res);
                console.log(res.affectedRows + "Employees viewed!\n");

                firstPrompt();
            });
        });
}

function addEmployee() {
    console.log("Inserting an employee!")
  
    var query =
      `SELECT r.id, r.title, r.salary 
        FROM role r`
  
    connection.query(query, function (err, res) {
      if (err) throw err;
  
      const roleChoices = res.map(({ id, title, salary }) => ({
        value: id, title: `${title}`, salary: `${salary}`
      }));
  
      console.table(res);
      console.log("RoleToInsert!");
  
      promptInsert(roleChoices);
    });
}

function promptInsert(roleChoices) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the first name of the employee?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?"
            },
            {
                type: "list",
                name: "roleId",
                message: "What is the employee's role?",
                choices: roleChoices
            },
        ])
        .then(function (answer){
            console.log(answer);
            
            var query = `SAVE TO employee DATABASE ?`
            connection.query(query,
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role_id,
                },
                function (err, res) {
                    if (err) throw err;

                    console.table(res);
                    console.log(res.insertedRows + "Successful!\n")

                    firstPrompt();
                });
        });
}

function removeEmployee() {
    console.log("Employee deletion");

    var query =
    `SELECT e.id, e.first_name, e.last_name
    FROM employee e`

    connection.query(query, function (err, res){
        if (err) throw err;

        const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
            value: id, name: `${id} ${first_name} ${last_name}`
        }));
      
        console.table(res);
        console.log("ArrayToDelete!\n");
      
        promptDelete(deleteEmployeeChoices);
    });
}

function promptDelete(deleteEmployeeChoices) {
    inquirer
        .prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee would you like to delete?",
                choices: deleteEmployeeChoices
            }
        ])
        .then(function (answer){
            var query = `DELETE FROM employee WHERE ?`;
            connection.query(query, {id: answer.employeeId}, function (err, res) {
                if (err) throw err;

                console.table(res);
                console.log(res.affectedRows + "Deleted!\n");

                firstPrompt();
            });
        });
}

function updateEmployee() {
    employeeArray();
}

function employeeArray() {
    console.log("Employee update");

    var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role r
      ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    JOIN employee m
      ON m.id = e.manager_id`

    connection.query(query, function (err, res){
        if (err) throw err;

        const employeeChoices = res.map(({ id, first_name, last_name }) => ({
            value: id, name: `${first_name} ${last_name}`      
          }));
      
          console.table(res);
          console.log("employeeArray To Update!\n")
      
          roleArray(employeeChoices);
    });
}

function roleArray(employeeChoices) {
    console.log("Updating role");

    var query =
    `SELECT r.id, r.title, r.salary 
    FROM role r`
    let roleChoices;

    connection.query(query, function (err, res){
        if (err) throw err;

        roleChoices = res.map(({ id, title, salary }) => ({
            value: id, title: `${title}`, salary: `${salary}`      
        }));
    
        console.table(res);
        console.log("roleArray updated!\n")

        promptEmployeeRole(employeeChoices, roleChoices);
    });
}

function promptEmployeeRole(employeeChoices, roleChoices) {
    inquirer
        .prompt ([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee would you like to assign the role to?",
                choices: employeeChoices
            },
            {
                type: "list",
                name: "roleId",
                message: "Which role do you want to update?",
                choices: roleChoices
            },
        ])
        .then(function (answer){
            var query = `UPDATE employee SET role_id = ? WHERE id = ?`
            connection.query(query,
                [ answer.role_id,
                answer.employeeId
            ],
            function (err, res) {
                if (err) throw err;

                console.table(res);
                console.log(res.affectedRows + "Update successful!");

                firstPrompt();
            });
        });
}

function addRole() {
    var query =
    `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    JOIN role r
    ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`
    
    connection.query(query, function (err, res) {
        if (err) throw err;

        const departmentChoices = res.map(({ id, name }) => ({
            value: id, name: `${id} ${name}`
        }));

        console.table(res);
        console.log("Department array!");

        promptAddRole(departmentChoices);
    });
}

function promptAddRole(departmentChoices) {
    inquirer
    .prompt ([
        {
            type: "input",
            name: "roleTitle",
            message: "Role?"
        },
        {
            type: "list",
            name: "departmentId",
            message: "Department?",
            choices: departmentChoices
        },
    ])
    .then(function (answer){
        var query = `INSERT INTO role SET ?`

        connection.query(query, {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId
        },
          function (err, res) {
            if (err) throw err;
  
            console.table(res);
            console.log("Role Inserted!");
  
            firstPrompt();
          });  
    });
}