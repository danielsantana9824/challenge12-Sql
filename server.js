const express = require('express');
const inquirer = require("inquirer");
const colors = require("colors");
const { printTable } = require('console-table-printer');

const Deparment = require("./actions/department");
const Roles = require('./actions/roles');
const Employee = require('./actions/employee');
const intento = new Deparment;
const employeeClass = new Employee;
const roles = new Roles;

// function init(){

const questions = [
    {
        type: "list",
        message: colors.magenta("What table do you want to work?"),
        name: "table",
        choices: ["Department", "Roles", "Employee"]
    },
    {
        type: "list",
        message: colors.magenta("What do you want to do?"),
        name: "action",
        choices: ["Create", "Modify", "Delete", "Read"]
    }
];

// process(questions);

// }

// function process(questions){

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    // console.log(`Server running on port ${PORT}`);
});


inquirer.prompt(questions).then(async (res) => {

    switch (res.table) {

        case "Department":

            switch (res.action) {

                case "Create":

                    const { newName } = await inquirer.prompt([
                        {
                            type: "input",
                            message: colors.magenta("Enter name for the department:"),
                            name: "newName"
                        }
                    ]);

                    const createDepartments = await intento.createDepartment(newName);
                    console.log("Department create:", createDepartments);
                    break;

                case "Read":
                    try {
                        const departments = await intento.getDepartments();
                        printTable(departments);

                    } catch (error) {
                        console.error("Error al obtener departamentos:", error);
                    }
                    break;

                case "Modify":
                    try {
                        const departments = await intento.getDepartments();

                        const departmentChoices = departments.map(dept => ({
                            name: `${dept.name}`,
                            value: dept.id
                        }));

                        const { departmentId } = await inquirer.prompt([
                            {
                                type: "list",
                                message: colors.magenta("Which department do you want to modify?"),
                                name: "departmentId",
                                choices: departmentChoices
                            }
                        ]);

                        console.log(`Department selected for modification: ${departmentId}`);

                        const { newName } = await inquirer.prompt([
                            {
                                type: "input",
                                message: colors.magenta("Enter the new name for the department:"),
                                name: "newName"
                            }
                        ]);

                        const updatedDepartment = await intento.updateDepartment(departmentId, newName);
                        console.log("Department updated:", updatedDepartment);

                    } catch (error) {
                        console.error("Error al modificar el departamento:", error);
                    }
                    break;

                case "Delete":
                    const departments = await intento.getDepartments();

                    const departmentChoices = departments.map(dept => ({
                        name: `${dept.name}`,
                        value: dept.id
                    }));

                    const { departmentId } = await inquirer.prompt([
                        {
                            type: "list",
                            message: colors.magenta("Which department do you want to delete?"),
                            name: "departmentId",
                            choices: departmentChoices
                        }
                    ]);

                    const deleteDepartment = await intento.deleteDepartment(departmentId);
                    console.log("Department delete:", deleteDepartment);
                    break;

            }

            break;

        case "Roles":

            switch (res.action) {

                case "Create":

                    const departments = await intento.getDepartments();

                    const departmentChoices = departments.map(dept => ({
                        name: `${dept.name}`,
                        value: dept.id
                    }));

                    const newName = await inquirer.prompt([
                        {
                            type: "input",
                            message: colors.magenta("Enter title for the Role:"),
                            name: "newTitle"
                        },
                        {
                            type: "input",
                            message: colors.magenta("Enter salary for the Role:"),
                            name: "salary"
                        },
                        {
                            type: "list",
                            message: colors.magenta("What do you want to do?"),
                            name: "deparment",
                            choices: departmentChoices
                        }
                    ]).then(async (newName) => {
                        const createRoles = await roles.createRole(newName.newTitle, newName.salary, newName.deparment);
                        console.log("role create:", newName);

                    });
                    break;

                case "Delete":
                    const rolesData = await roles.getRoles();

                    const rolesChoices = rolesData.map(role => ({
                        name: `${role.title}`,
                        value: role.id
                    }));

                    const { roleId } = await inquirer.prompt([
                        {
                            type: "list",
                            message: colors.magenta("Which rol do you want to delete?"),
                            name: "roleId",
                            choices: rolesChoices
                        }
                    ]);

                    const deleteRol = await roles.deleteRole(roleId);
                    console.log("Rol delete:", deleteRol);
                    break;

                case "Read":
                    try {
                        const rolesData = await roles.getRoles();
                        printTable(rolesData);

                    } catch (error) {
                        console.error("Error al obtener roles:", error);
                    }
                    break;

                case "Modify":
                    try {
                        const rolesData = await roles.getRoles();

                        const rolesChoices = rolesData.map(role => ({
                            name: `${role.title}`,
                            value: role.id
                        }));

                        const departments = await intento.getDepartments();

                        const departmentChoices = departments.map(dept => ({
                            name: `${dept.name}`,
                            value: dept.id
                        }));

                        const { rolesId } = await inquirer.prompt([
                            {
                                type: "list",
                                message: colors.magenta("Which role do you want to modify?"),
                                name: "rolesId",
                                choices: rolesChoices
                            }
                        ]);

                        console.log(`rol selected for modification: ${rolesId}`);

                        const newName = await inquirer.prompt([
                            {
                                type: "input",
                                message: colors.magenta("Enter title for the Role:"),
                                name: "newTitle"
                            },
                            {
                                type: "input",
                                message: colors.magenta("Enter salary for the Role:"),
                                name: "salary"
                            },
                            {
                                type: "list",
                                message: colors.magenta("What deparment do you want to assign?"),
                                name: "deparment",
                                choices: departmentChoices
                            }
                        ]).then(async (newName) => {
                            const salary = parseFloat(newName.salary);
                            const createRoles = await roles.updateRole(rolesId, newName.newTitle, salary, newName.deparment);
                            console.log("role update:", createRoles);

                        });
                    } catch (error) {
                        console.error("Error al modificar el rol:", error);
                    }
                    break
            }
            break;


        case "Employee":
            switch (res.action) {

                case "Create":
                    try {
                        const rolesData = await roles.getRoles();
                        const rolesChoices = rolesData.map(role => ({
                            name: `${role.title}`,
                            value: role.id
                        }));

                        const existingEmployees = await employeeClass.getEmployees();
                        const managerChoices = existingEmployees.map(employee => ({
                            name: `${employee.first_name} ${employee.last_name}`,
                            value: employee.id
                        }));
                        managerChoices.unshift({ name: 'No manager', value: null });  

                        const newEmployee = await inquirer.prompt([
                            {
                                type: "input",
                                message: colors.magenta("Enter First Name"),
                                name: "firstName"
                            },
                            {
                                type: "input",
                                message: colors.magenta("Enter Last Name"),
                                name: "lastName"
                            },
                            {
                                type: "list",
                                message: colors.magenta("Which role do you want to assign?"),
                                name: "roleId",
                                choices: rolesChoices
                            },
                            {
                                type: "list",
                                message: colors.magenta("Select a manager for this employee (or select 'No manager'):"),
                                name: "managerId",
                                choices: managerChoices
                            }
                        ]);

                        const createdEmployee = await employeeClass.createEmployee(
                            newEmployee.firstName,
                            newEmployee.lastName,
                            newEmployee.roleId,
                            newEmployee.managerId
                        );

                        console.log("Employee created:", createdEmployee);

                    } catch (error) {
                        console.error("Error creating employee:", error);
                    }
                    break;


                case "Read":
                    try {
                        const employee = await employeeClass.getEmployees();
                        printTable(employee);

                    } catch (error) {
                        console.error("Error al obtener employees:", error);
                    }
                    break;

                case "Delete":

                    const employee = await employeeClass.getEmployees();

                    const employChoices = employee.map(employ => ({
                        name: `${employ.first_name} ${employ.last_name}`,
                        value: employ.id
                    }));

                    const { employId } = await inquirer.prompt([
                        {
                            type: "list",
                            message: colors.magenta("Which employ do you want to delete?"),
                            name: "employId",
                            choices: employChoices
                        }
                    ]);

                    const deleteEmploy = await employeeClass.deleteEmployee(employId);
                    console.log("Employ delete:", deleteEmploy);
                    break;

                case "Modify":
                    try {
                        const employees = await employeeClass.getEmployees();

                        const employeeChoices = employees.map(employee => ({
                            name: `${employee.first_name} ${employee.last_name}`,
                            value: employee.id
                        }));

                        const rolesData = await roles.getRoles();
                        const roleChoices = rolesData.map(role => ({
                            name: `${role.title}`,
                            value: role.id
                        }));

                        const { employeeId } = await inquirer.prompt([
                            {
                                type: "list",
                                message: colors.magenta("Which employee do you want to modify?"),
                                name: "employeeId",
                                choices: employeeChoices
                            }
                        ]);

                        const updatedEmployee = await inquirer.prompt([
                            {
                                type: "input",
                                message: colors.magenta("Enter First Name"),
                                name: "firstName"
                            },
                            {
                                type: "input",
                                message: colors.magenta("Enter Last Name"),
                                name: "lastName"
                            },
                            {
                                type: "list",
                                message: colors.magenta("Which role do you want to assign?"),
                                name: "roleId",
                                choices: roleChoices
                            },
                            {
                                type: "list",
                                message: colors.magenta("Select Manager for the Employee"),
                                name: "managerId",
                                choices: [{ name: "No Manager", value: null }].concat(employeeChoices)
                            }
                        ]);

                        const updated = await employeeClass.updateEmployee(
                            employeeId,
                            updatedEmployee.firstName,
                            updatedEmployee.lastName,
                            updatedEmployee.roleId,
                            updatedEmployee.managerId
                        );

                        console.log("Employee updated:", updated);
                    } catch (error) {
                        console.error("Error modifying employee:", error);
                    }
                    break;


            }
            break

        default:
            console.log("Something is wrong");
            break;
    }

});