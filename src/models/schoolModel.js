const { promisePool } = require('../config/database');

class SchoolModel {
    static async createSchool(schoolData) {
        const { name, address, latitude, longitude } = schoolData;
        const query = `
            INSERT INTO schools (name, address, latitude, longitude)
            VALUES (?, ?, ?, ?)
        `;
        
        const [result] = await promisePool.execute(query, [name, address, latitude, longitude]);
        return result.insertId;
    }
    
    static async getAllSchools() {
        const query = 'SELECT id, name, address, latitude, longitude FROM schools';
        const [rows] = await promisePool.execute(query);
        return rows;
    }
    
    static async getSchoolById(id) {
        const query = 'SELECT id, name, address, latitude, longitude FROM schools WHERE id = ?';
        const [rows] = await promisePool.execute(query, [id]);
        return rows[0];
    }
}

module.exports = SchoolModel;