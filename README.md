# Employee Tracker

## Table of Contents

- [Description](#description)
- [Video Walkthrough](#video-walkthrough)
- [Installation](#installation)
- [Usage](#usage)
- [Acceptance Criteria](#acceptance-criteria)
- [Tests](#tests)
- [License](#license)
- [Questions](#questions)

## Description

A command-line application that allows a user to perform create, read, update, and delete (CRUD) functions on a SQL database representing the departments, roles and employees of a company.

## Video Walkthrough

The following video shows an example of the application being used from the command line:
[Screencastify](https://drive.google.com/file/d/1cBksWMX-IOk58SeHmgdeX0jo427uiHvQ/view)

## Installation

This app uses inquirer.js, mysql2, console.table, and comma-number. Run `npm install` in the root directory to download these dependencies. Since it interacts with a SQL database, a SQL interface is also required. The user will need to enter their MySQL username and password in `index.js` to connect to their local database to run this application.

## Usage

First, download the schema.sql file to create the database and three tables that contain the info for departments, roles, and employees. A seeds.sql file is included as an example. You can seed the database by following the prompts and/or by running `mysql -u root -p` and `source seeds.sql` to see the seeded data.
![Schema](/Assets/schema.png)

To start the app, run the command `node index` in the terminal. The user sees the app banner and provided a list of choices to execute various CRUD functions.

![Start](/Assets/app-start.png)

The first three options are GET requests for viewing the data for the three databases. If `View Employees` is selected, the user can sort the employees in three different ways: Alphabetically by last name, by manager, and by department.

![Employee Options](/Assets/employee-options.png)

The remaining options include logic to meet the following acceptance criteria and bonus functionality.

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
```

## Bonus Functionality Includes:

```
Ability to update employee managers

Ability to view employees by manager

Ability to view employees by department

Ability to delete departments, roles, and employees

Ability to view the total utilized budget of a department—in other words, the combined salaries of all employees in that department
```

## Tests

This repository does not include any unit tests.

## License

![badge](https://img.shields.io/badge/license-MIT-brightgreen)

Content in this project is covered by the MIT license.

## Questions?

Questions about this project can be directed to:

- Email: sherri.a.knight@gmail.com
- You can view more of my projects at https://github.com/iamjoyfulgirl.

---

Employee Tracker - Copyright 2022 Sherri Knight
