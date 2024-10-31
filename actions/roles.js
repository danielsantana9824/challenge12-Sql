const db = require("../db");

class Roles extends db {

    async getRoles() {
        const result = await this.query('SELECT * FROM roles ORDER BY id ASC');
        return result.rows;
    }

    async createRole(title, salary, department_id) {
        const result = await this.query(
            'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *',
            [title, salary, department_id]
        );
        return result.rows[0];
    }

    async updateRole(id, title, salary, department_id) {
        const result = await this.query(
            'UPDATE roles SET title = $1, salary = $2, department_id = $3 WHERE id = $4 RETURNING *',
            [title, salary, department_id, id]
        );
        return result.rows[0];
    }

    async deleteRole(id) {
        const result = await this.query(
            'DELETE FROM roles WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }
}


module.exports = Roles;
