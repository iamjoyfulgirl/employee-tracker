const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');
const commaNumber = require('comma-number');
const Department = require(__dirname + '/classes/Department.js');
const Role = require(__dirname + '/classes/Role.js');
const Employee = require(__dirname + '/classes/Employee.js');

// Connect to the DB and display application greeting

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Bxa75!@#M!',
    database: 'company_db'
});


// Application greeting and begin prompts

console.log("***********************************")
console.log("*                                 *")
console.log("*        EMPLOYEE TRACKER         *")
console.log("*                                 *")
console.log("***********************************")
connection.connect();
init();

function init() {
    console.log('\n\n')
    inquirer.prompt([
        {
            type: 'list',
            name: 'init',
            message: 'What would you like to do?',
            choices: ['View Departments', 'View Roles', 'View Employees', 'View Department Budget', 'Update Employee', 'Add Department', 'Add Role', 'Add Employee', 'Delete Department', 'Delete Role', 'Delete Employee', 'Exit Employee Tracker'],
            pageSize: 12
        }
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
            case 'View Employees':
                viewEmployees();
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


// =============
// ADD FUNCTIONS
// =============
// Add departments
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the new department?',
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

function insertDepartment(newDepot) {
    connection.query('INSERT INTO departments SET ?', new Department(newDepot), (err, res) => {
        if (err) throw err;
        console.log(`Successfully added ${newDepot} to Departments`);
        init();
    });
}

// Add Roles
// title, salary, department
function addRole() {
    const array = [];
    getDepartmentsAsync()
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                array.push(data[i])
            }
        })
        .catch(err => {
            console.log(err);
        });

    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role?',
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
            message: 'What is the salary of the new role?',
            default: () => { },
            validate: salary => {
                let valid = /^\d+(\.\d{0,2})?$/.test(salary);
                if (valid) {
                    return true;
                } else {
                    console.log(`. Please enter in a valid number`)
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
                departmentId = array[i].id;
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


// Add Employees

// First get an array of objects that includes
// role titles and ids
// employee last names and ids

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
                let valid = /^[a-zA-Z0-9 ]{1,30}$/.test(firstName);
                if (valid) {
                    return true;
                } else {
                    console.log(`. Your name must be between 1 and 30 characters.`)
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
                    console.log(`. Your name must be between 1 and 30 characters.`)
                    return false;
                }
            }

        },
        {
            type: 'list',
            name: 'role',
            message: `What is the employee's role?`,
            choices: rolesNames
        },
        {
            type: 'list',
            name: 'manager',
            message: `Who is the employee's manager?`,
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
    connection.query('INSERT INTO employees SET ?', new Employee(firstName, lastName, roleId, managerId), (err, res) => {
        if (err) throw err;
        console.log(`Successfully added ${firstName} ${lastName} to Employees`);
        init();
    });
}


// ==============
// VIEW FUNCTIONS
// ==============


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
    connection.query(`SELECT r.title AS 'Role', r.id AS 'ID', d.name AS 'Department', r.salary AS 'Salary'
                      FROM roles r
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
    connection.query(`SELECT e.last_name AS 'Last Name', e.first_name AS 'First Name', e.id AS 'ID', r.title AS 'Role', r.salary AS 'Salary', d.name AS 'Department'
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
    connection.query(`SELECT d.name AS 'Department', e.last_name AS 'Last Name', e.first_name AS 'First Name', e.id AS 'ID', r.title AS 'Role', r.salary AS 'Salary'
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
            choices: rolesNames,
            pageSize: 12
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
            choices: employeesNames,
            pageSize: 12
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
            choices: employeesNames,
            pageSize: 12
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
            choices: departmentsNames,
            pageSize: 12
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
            choices: rolesNames,
            pageSize: 12
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


// Query to get all the salaries from a department
// View the total utilized budget of a department
(`SELECT r.salary
FROM employees e
JOIN roles r
ON e.role_id = r.id
JOIN departments d
ON r.department_id = d.id 
WHERE d.id = 1`)

function viewDepartmentBudget() {
    const departmentsData = [];
    const departmentsNames = [];
    getDepartmentsAsync()
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                departmentsData.push(data[i]);
                departmentsNames.push(data[i].name);
            }
            viewBudgetQuestions(departmentsData, departmentsNames);
        }).catch(err => {
            console.log(err);
        });
}

function viewBudgetQuestions(departmentsData, departmentsNames) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'Which department budget would you like to see?',
            choices: departmentsNames
        }
    ]).then(answers => {
        let departmentId;
        for (let i = 0; i < departmentsData.length; i++) {
            if (answers.name === departmentsData[i].name) {
                departmentId = departmentsData[i].id;
            }
        }
        getDepartmentBudget(departmentId, answers.name);
    });
}

function getDepartmentBudget(departmentId, name) {
    connection.query(`SELECT r.salary
                      FROM employees e
                      JOIN roles r
                      ON e.role_id = r.id
                      JOIN departments d
                      ON r.department_id = d.id 
                      WHERE ?`, { 'd.id': departmentId },
        (err, data) => {
            if (err) throw err;
            calculateDepartmentBudget(data, name);
        });
}


function calculateDepartmentBudget(data, name) {
    let departmentBudget = 0;
    for (let i = 0; i < data.length; i++) {
        departmentBudget += data[i].salary;
    }
    departmentBudget = departmentBudget.toFixed(2);
    departmentBudget = commaNumber(departmentBudget);
    console.log(`\nThe budget for ${name} is $${departmentBudget}`);
    init();
}



// ===============
// Async Functions
// ===============

function getRolesAsync() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT id, title AS 'role' FROM roles ORDER BY role`, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}

function getEmployeesAsync() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT id, last_name FROM employees ORDER BY last_name`, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}

function getDepartmentsAsync() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM departments`, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    })
}