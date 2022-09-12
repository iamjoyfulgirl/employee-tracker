require('dotenv').config();
// import required packages
const express = require('express');
// Import and require mysql2
const mysql = require('mysql2'); //changed to mysql2; if it doesn't work chg to mysql
const PORT = process.env.PORT || 3001;
const app = express();

const cTable = require('console.table');
const inquirer = require('inquirer');
const commaNumber = require('comma-number');
const Department = require(__dirname + '/classes/Department.js');
const Role = require(__dirname + '/classes/Role.js');
const Employee = require(__dirname + '/classes/Employee.js');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'company_db'
});

// Connect to the DB and display application greeting
connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  afterConnection();
});

// function after connection is established and welcome image shows 
afterConnection = () => {
  console.log("***********************************")
  console.log("*                                 *")
  console.log("*        EMPLOYEE MANAGER         *")
  console.log("*                                 *")
  console.log("***********************************")
  promptUser();
};

// inquirer prompt for first action
const promptUser = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'choices',
      message: 'What would you like to do?',
      choices: ['View Departments', 'View Roles', 'View Employees', 'View Department Budget', 'Update Employee', 'Add Department', 'Add Role', 'Add Employee', 'Delete Department', 'Delete Role', 'Delete Employee', 'Exit Employee Tracker']
    }

    // switch case to handle user's choices
  ]).then((answers) => {
    switch (answers.init) {
      case 'Exit Employee Tracker':
        connection.end();
        console.log('Goodbye');
        break;
      case 'Update Employee':
        updateEmployee();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'View Departments':
        viewDepartments();
        break;
      case 'View Employee':
        viewEmployee();
        break;
      case 'View Roles':
        viewRoles();
        break;
      case 'View Department Budget':
        viewDepartmentBudget();
        break;
      case 'Delete Employee':
        deleteEmployee();
        break;
      case 'Delete Department':
        deleteDepartment();
        break;
      case 'Delete Role':
        deleteRole();
        break;
    }
  })
}

// ~~~~~~~~~~~~~
// ADD Functions
// ~~~~~~~~~~~~~
// Add departments
function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: `What is the name of the new department?`,
      default: () => { },
      validate: name => {
        let valid = /^[a-zA-Z0-9 ]{1,30}$/.test(name);
        if (valid) {
          return true;
        } else {
          console.log(`. Your name must be between 1 and 30 characters.`)
          return false;
        }
      }
    }
  ]).then((answers) => {
    insertDepartment(answers.name);
  });
}

function insertDepartment(newDepartment) {
  connection.query('INSERT INTO departments SET?', new Department(newDepartment), (err, res) => {
    if (err) throw err;
    console.log(`Successfully added ${newDeparment} to Departments`);
    init();
  });
}

// Add roles
// Title, Salary, Department 
function addRole() {
  const array = []; getDepartmentsAsync(departmentId)
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        array.push(data[i]);
      }
    })

  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: `What is the title of the new role?`,
      default: () => { },
      validate: title => {
        let valid = /^[a-zA-Z0-9 ]{1,30}$/.test(title);
        if (valid) {
          return true;
        } else {
          console.log(`. Your title must be between 1 and 30 characters.`)
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'salary',
      message: `What is the salary of the new role?`,
      default: () => { },
      validate: salary => {
        let valid = /^\d+(\.\d{0,2})?$/.test(salary);
        if (valid) {
          return true;
        } else {
          console.log(`. Please enter a valid number.`)
          return false;
        }
      }
    },
    {
      type: 'list',
      name: 'department',
      message: 'In which department is the new role?',
      choices: array
    }
  ]).then(answers => {
    let departmentId;
    for (let i = 0; i < array.length; i++) {
      if (answers.department === array[i].name) {
        deparmentId = array[i].id;
      }
    }
    insertRole(answers.title, answers.salary, departmentId);
  })

}

function insertRole(title, salary, department_id) {
  connection.query('INSERT INTO roles SET ?', new Role(title, salary, department_id), (err, res) => {
    if (err) throw err;
    console.log(`Successfully added ${title} to Roles`);
    init();
  });
}

// ADD EMPLOYEES
// Get array of objects that includes roles, titles and ids, emplyee last names and ids

function addEmployee() {
  const rolesData = [];
  const rolesNames = [];
  const employeesData = [];
  const employeesNames = ['No Manager'];

  getRolesAsync()
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        rolesData.push(data[i]);
        rolesNames.push(data[i].role)
      }

      getEmployeesAsync()
        .then(data => {
          for (let i = 0; i < data.length; i++) {
            employeesData.push(data[i]);
            employeesNames.push(data[i].last_name)
          }
        }).catch(err => {
          console.log(err);
        })
    }).catch(err => {
      console.log(err);
    });

  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: `What is the employee's first name?`,
      default: () => { },
      validate: firstName => {
        let valid = /^[a-zA-Z0-9 ]{1,30}$/.test
          (firstName);
        if (valid) {
          return true;
        } else {
          console.log(`. First name must be between 1 and 30 characters.`)
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: `What is the employee's last name?`,
      default: () => { },
      validate: lastName => {
        let valid = /^[a-zA-Z0-9 ]{1,30}$/.test(lastName);
        if (valid) {
          return true;
        } else {
          console.log(`. Last name must be between 1 and 30 characters.`)
          return false;
        }
      }

    },
    {
      type: 'list',
      name: 'role',
      message: `What is the employee's role?`,
      choices: roleNames
    },
    {
      type: 'list',
      name: 'manager',
      message: `who is the employee's manager?`,
      choices: employeesNames
    }
  ]).then(answers => {
    let roleId;
    let managerId;

    for (let i = 0; i < rolesData.length; i++) {
      if (answers.role === rolesData[i].role) {
        roleId = rolesData[i].id;
      }
    }

    for (let i = 0; i < employeesData.length; i++) {
      if (answers.manager === employeesData[i].last_name) {
        managerId = employeesData[i].id;
      } else if (answers.manager === 'No Manager') {
        managerId = null;
      }
    }
    insertEmployee(answers.firstName, answers.lastName, roleId, managerId);
  });
}

function insertEmployee(firstName, lastName, roleId, managerId) {
  connection.query('INSERT INTO employees SET ?', new Employee
    (firstName, lastName, roleId, managerId), (err, res) => {
      console.log(`Successfully added ${firstName} ${lastName} to Employees`);
      init();
    });
}
