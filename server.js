const express = require('express');
const inquirer = require("inquirer");
const colors = require("colors");
const { printTable } = require('console-table-printer');

const Deparment = require("./actions/department");
const intento = new Deparment;

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

                    const updatedDepartments = await intento.createDepartment(newName);
                    console.log("Department updated:", updatedDepartments);

                    init();
                    break;

                case "Read":
                    try {
                        const departments = await intento.getDepartments();
                        printTable(departments);

                        process();
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
                            message: colors.magenta("Which department do you want to modify?"),
                            name: "departmentId",
                            choices: departmentChoices
                        }
                    ]);

                    const updatedDepartment = await intento.deleteDepartment(departmentId);
                    console.log("Department delete:", updatedDepartment);
                    break;

            }

            break;

        default:
            console.log("Something is wrong");
            break;
    }

});
// }