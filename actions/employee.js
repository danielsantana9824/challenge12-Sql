const db = require("../db");

class Employee extends db {

    async getEmployees() {
        const result = await this.query('SELECT  e.id AS id, e.first_name,e.last_name,r.title AS job_title,e.roles_id AS roles,d.name AS deparment,e.manager_id AS manager ,r.salary AS role_salary FROM employee e left JOIN roles r ON e.roles_id = r.id left JOIN department d ON r.department_id =  d.id ORDER BY e.id;');

        return result.rows;
    }

    async createEmployee(first_name, last_name, roles_id, manager_id = null) {
        const result = await this.query(
            'INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [first_name, last_name, roles_id, manager_id]
        );
        return result.rows[0];
    }

    async updateEmployee(id, first_name, last_name, roles_id, manager_id = null) {
        const result = await this.query(
            'UPDATE employee SET first_name = $1, last_name = $2, roles_id = $3, manager_id = $4 WHERE id = $5 RETURNING *',
            [first_name, last_name, roles_id, manager_id, id]
        );
        return result.rows[0];
    }

    async deleteEmployee(id) {
        const result = await this.query(
            'DELETE FROM employee WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }

    async getEmployeesByManager() {

        const result = await this.query(`
            SELECT 
                e.first_name AS employee_first_name,
                e.last_name AS employee_last_name,
                m.id AS manager_id,
                m.first_name AS manager_first_name,
                m.last_name AS manager_last_name
            FROM 
                employee e
            LEFT JOIN 
                employee m ON e.manager_id = m.id
            ORDER BY 
                manager_id;
        `);
        return result.rows;

    }

    async getEmployeesByDepartment() {
        const result = await this.query(`
          SELECT 
            e.id AS employee_id,
            e.first_name,
            e.last_name,
            r.title AS role_title,
            d.name AS department_name
            FROM 
                employee e
            LEFT JOIN 
                roles r ON e.roles_id = r.id
            LEFT JOIN 
                department d ON r.department_id = d.id
            ORDER BY 
                d.name, e.last_name;
        `);

        return result.rows;
    }

    async getSalaryByDeparment(id) {
        const result = await this.query(
            'SELECT d.name AS department_name,  COALESCE(SUM(r.salary), 0) AS total_salary FROM department d LEFT JOIN roles r ON d.id = r.department_id LEFT JOIN employee e ON r.id = e.roles_id  WHERE d.id = $1 GROUP BY d.id, d.name;', [id]
        );
        return result.rows;
    }
}

module.exports = Employee;
