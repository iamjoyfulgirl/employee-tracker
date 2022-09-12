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


// VIEW FUNCTIONS

// View departments
function viewDepartments() {
  connection.query(`SELECT name AS 'Departments', id AS 'ID' FROM departments`, (err, res) => {
    if (err) throw err;
    console.log('\n\n')
    console.table(res);
    init();
  });
}

// View Roles
function viewRoles() {
  connection.query(`SELECT r.title AS 'Role', r.id AS 'ID', d.name AS 'Department', r.salary AS 'Salary' FROM roles r
  JOIN departments d
  ON r.department_id = d.id
  ORDER BY r.department_id`,
    (err, res) => {
      if (err) throw err;
      console.log('\n\n')
      console.table(res);
      init();
    });
}

// View Employees
function viewEmployees() {
  inquirer.prompt([
    {
      name: 'sortBy',
      type: 'list',
      message: 'How would you like to sort your employees?',
      choices: ['Last name', 'Manager', 'Department']
    }
  ]).then((answers) => {
    switch (answers.sortBy) {
      case 'Last name':
        sortByLastName();
        break;
      case 'Manager':
        sortByManager();
        break;
      case 'Department':
        sortByDepartment();
        break;
    }
  })
}

function sortByLastName() {
  connection.query(`SELECT e.last_name AS 'Last Name', e.first_name AS 'First Name', e.id AS 'ID', r.title AS 'Role', d.name AS 'Department'
                FROM employees e
                JOIN roles r
                ON e.role_id = r.id
                LEFT JOIN departments d
                ON r.department_id = d.id
                ORDER BY e.last_name`, (err, res) => {
    if (err) throw err;
    console.log('\n\n')
    console.table(res);
    init();
  });
}

function sortByManager() {
  connection.query(`SELECT e.last_name AS 'Employee Last Name', e.first_name AS 'Employee First Name', e.id AS 'ID', m.last_name AS 'Manager'
                    FROM employees e
                    LEFT JOIN employees m
                    ON e.manager_id = m.id
                    ORDER BY m.last_name, e.last_name`, (err, res) => {
    if (err) throw err;
    console.log('\n\n')
    console.table(res);
    init();
  });

}

function sortByDepartment() {
  connection.query(`SELECT d.name AS 'Department', e.last_name AS 'Last Name', e.first_name AS 'First Name', e.id AS 'ID', r.title AS 'Role'
                    FROM employees e
                    JOIN roles r
                    ON e.role_id = r.id
                    LEFT JOIN departments d
                    ON r.department_id = d.id
                    ORDER BY d.name, e.last_name`, (err, res) => {
    if (err) throw err;
    console.log('\n\n')
    console.table(res);
    init();
  });
}

// Update Employee Information

function updateEmployee() {
  const rolesData = [];
  const rolesNames = [];

  const employeesData = [];
  const employeesNames = [];

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
          updateEmployeeQuestions(rolesData, rolesNames, employeesData, employeesNames);
        }).catch(err => {
          console.log(err);
        })
    }).catch(err => {
      console.log(err);
    });
}

function updateEmployeeQuestions(rolesData, rolesNames, employeesData, employeesNames) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'employee',
      message: 'Which employee would you like to update?',
      choices: employeesNames,
      pageSize: 12
    },
    {
      type: 'list',
      name: 'update',
      message: 'What information would you like to update?',
      choices: [`Employee's role`, `Employee's manager`, 'Cancel']
    }
  ]).then(answers => {
    let employeeId;
    for (let i = 0; i < employeesData.length; i++) {
      if (answers.employee === employeesData[i].last_name) {
        employeeId = employeesData[i].id;
      }
    }
    if (answers.update === `Employee's role`) {
      getNewRoleId(employeeId, rolesData, rolesNames)
    } else if (answers.update === `Employee's manager`) {
      employeesNames.push('No Manager');
      getManagerId(employeeId, employeesData, employeesNames)
    } else {
      init();
    }
  })
}

function getNewRoleId(employeeId, rolesData, rolesNames) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'role',
      message: `What is the employee's new role?`,
      choices: rolesNames
    }
  ]).then(answers => {
    let roleId;
    for (let i = 0; i < rolesData.length; i++) {
      if (answers.role === rolesData[i].role) {
        roleId = rolesData[i].id;
      }
    }
    updateEmployeeRole(employeeId, roleId)
  })
}

function updateEmployeeRole(employeeId, roleId) {
  connection.query(`UPDATE employees SET ? WHERE ?`, [
    {
      role_id: roleId
    },
    {
      id: employeeId
    }
  ],
    (err, res) => {
      if (err) throw err;
      console.log(`Successfully changed employee's role`);
      init();
    })
}

function getManagerId(employeeId, employeesData, employeesNames) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'manager',
      message: `Who is the employee's new manager?`,
      choices: employeesNames
    }
  ]).then(answers => {
    let managerId;
    for (let i = 0; i < employeesData.length; i++) {
      if (answers.manager === employeesData[i].last_name) {
        managerId = employeesData[i].id;
      }
    }
    if (answers.manager === 'No Manager') {
      managerId = null;
    }
    updateEmployeeManager(employeeId, managerId)
  })
}

function updateEmployeeManager(employeeId, managerId) {
  connection.query(`UPDATE employees SET ? WHERE ?`, [
    {
      manager_id: managerId
    },
    {
      id: employeeId
    }
  ],
    (err, res) => {
      if (err) throw err;
      console.log(`Successfully changed employee's manager`);
      init();
    })
}

// Delete Employee

function deleteEmployee() {
  getEmployeesAsync()
    .then(data => {
      const employeesData = [];
      const employeesNames = [];
      for (let i = 0; i < data.length; i++) {
        employeesData.push(data[i]);
        employeesNames.push(data[i].last_name)
      }
      deleteEmployeeQuestions(employeesData, employeesNames)
    })
    .catch(err => {
      console.log(err);
    })
}

function deleteEmployeeQuestions(employeesData, employeesNames) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'name',
      message: 'Which employee would you like to delete?',
      choices: employeesNames
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure?'
    }
  ]).then(answers => {
    if (answers.confirm) {
      let employeeId;
      for (let i = 0; i < employeesData.length; i++) {
        if (answers.name === employeesData[i].last_name) {
          employeeId = employeesData[i].id;
        }
      }
      deleteEmployeeFromDb(employeeId, answers.name);
    } else {
      init();
    }
  })
}

function deleteEmployeeFromDb(employeeId, name) {
  connection.query(`DELETE FROM employees WHERE ?`, { id: employeeId }, (err, res) => {
    if (err) throw err;
    console.log(`Successfully deleted ${name} from the database.`);
    init();
  })
}

// Delete Department
function deleteDepartment() {
  const departmentsData = [];
  const departmentsNames = [];
  getDepartmentsAsync()
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        departmentsData.push(data[i]);
        departmentsNames.push(data[i].name);
      }
      deleteDepartmentQuestions(departmentsData, departmentsNames);
    }).catch(err => {
      console.log(err);
    })
}

function deleteDepartmentQuestions(departmentsData, departmentsNames) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'name',
      message: `Which department would you like to delete?`,
      choices: departmentsNames
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure?'
    }
  ]).then(answers => {
    if (answers.confirm) {
      let departmentId;
      for (let i = 0; i < departmentsData.length; i++) {
        if (answers.name === departmentsData[i].name) {
          departmentId = departmentsData[i].id;
        }
      }
      deleteDepartmentFromDb(departmentId, answers.name);
    } else {
      init();
    }
  });
}

function deleteDepartmentFromDb(departmentId, name) {
  connection.query(`DELETE FROM departments WHERE ?`, { id: departmentId }, (err, res) => {
    if (err) throw err;
    console.log(`Successfully deleted ${name} from the database.`);
    init();
  })
}

// Delete Role

function deleteRole() {
  getRolesAsync()
    .then(data => {
      const rolesData = [];
      const rolesNames = [];
      for (let i = 0; i < data.length; i++) {
        rolesData.push(data[i]);
        rolesNames.push(data[i].role);
      }
      deleteRoleQuestions(rolesData, rolesNames);
    }).catch(err => {
      console.log(err);
    })
}

function deleteRoleQuestions(rolesData, rolesNames) {
  inquirer.prompt([
    {
      type: 'list',
      name: 'name',
      message: 'Which role would you like to delete?',
      choices: rolesNames
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure?'
    }
  ]).then(answers => {
    if (answers.confirm) {
      let roleId;
      for (let i = 0; i < rolesData.length; i++) {
        if (answers.name === rolesData[i].role) {
          roleId = rolesData[i].id;
        }
      }
      deleteRoleFromDb(roleId, answers.name);
    } else {
      init();
    }
  })
}

function deleteRoleFromDb(roleId, name) {
  connection.query(`DELETE FROM roles WHERE ?`, { id: roleId }, (err, res) => {
    if (err) throw err;
    console.log(`Successfully deleted ${name} from database.`);
    init();
  })
}