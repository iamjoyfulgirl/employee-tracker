# Employee Tracker

![badge](https://img.shields.io/badge/license-MIT-brightgreen)

## Description

A command-line application to manage a company's employee database, using Node.js, Inquirer, and MySQL.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Tests](#tests)
- [License](#license)
- [Questions](#questions)

## Installation

This app uses inquirer.js, mysql2, console.table, and comma-number. Run `npm install` in the root directory to download these dependencies. Since it interacts with a SQL database, a SQL interface is also required. The user will need to enter their MySQL username and password in `index.js` to connect to their local database to run this application.

## Usage

First, download the schema.sql file to create the database and three tables that contain the info for departments, roles, and employees. A seeds.sql file is included as an example. You can seed the database by following the prompts and/or by running `mysql -u root -p` and `source seeds.sql` to see the seeded data.

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

## Mock-Up TODO

The following video shows an example of the application being used from the command line:

[![A video thumbnail shows the command-line employee management application with a play button overlaying the view.](./Assets/)]()

## Tests

N/A

## License

![badge](https://img.shields.io/badge/license-MIT-brightgreen)
<br />  
Content in this project is covered by the MIT license.

## Questions?

Questions about this project can be directed to:

- Email: sherri.a.knight@gmail.com
- You can view more of my projects at https://github.com/iamjoyfulgirl.

---

Employee Tracker - Copyright 2022 Sherri Knight

## Bonus

Try to add some additional functionality to your application, such as the ability to do the following:

- Update employee managers.

- View employees by manager.

- View employees by department.

- Delete departments, roles, and employees.

- View the total utilized budget of a department&mdash;in other words, the combined salaries of all employees in that department.

### Walkthrough Video

### Bonus

Fulfilling any of the following can add up to 20 points to your grade. Note that the highest grade you can achieve is still 100:

- Application allows users to update employee managers (2 points).

- Application allows users to view employees by manager (2 points).

- Application allows users to view employees by department (2 points).

- Application allows users to delete departments, roles, and employees (2 points for each).

- Application allows users to view the total utilized budget of a department&mdash;in other words, the combined salaries of all employees in that department (8 points).

## Review

You are required to submit BOTH of the following for review:

- A walkthrough video demonstrating the functionality of the application.

- The URL of the GitHub repository, with a unique name and a README describing the project.
