const db = require("../db");

class Deparment extends db {


    async getDepartments() {
        const result = await this.query('SELECT * FROM department');

        return result.rows;
    }

    async updateDepartment(id, newName) {
        const result = await this.query(
            'UPDATE department SET name = $1 WHERE id = $2 RETURNING *', 
            [newName, id]
        );
        return result.rows[0];
    }

    async deleteDepartment(id) {
        const result = await this.query(
            'DELETE FROM department WHERE id = $1 RETURNING *', 
            [id]
        );
        return result.rows[0];
    }

    async createDepartment(name) {
        const result = await this.query(
            'INSERT INTO department (name) VALUES ($1) RETURNING *', 
            [name]
        );
        return result.rows[0];
    }
}


module.exports = Deparment;
