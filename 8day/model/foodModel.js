const fs = require('fs');
const pool = require('./dbConnection');
const {prepareTable} = require('./prepareTable');

class Food {
    constructor() {
        const data = fs.readFileSync('./model/data.json');
        this.foods = JSON.parse(data)
    }

   
   
 
    
    getFoodList = async() => {   
        const sql = 'SELECT * from foods'
        let conn;
        try {
            conn = await pool.getConnection();
            const [rows, metadata] = await conn.query(sql);
            conn.release();
            return rows;
        } catch (error) {
            console.error(error);
        } finally {
            if ( conn ) conn.release();
        }
    }
    getFoodDetail = async(foodId) => {
        const sql = 'SELECT * from foods where id = ?';
        let conn;
        try {
            conn = await pool.getConnection();
            const [rows, metadata] = await conn.query(sql, foodId);
            conn.release();
            console.log(rows);
            return rows[0];
        } catch (error) {
            console.error(error);
        } finally {
            if ( conn ) conn.release();
        }
    }

  
  
    addFood = async(food, kind, explanation) => {

    
        const data = [food, kind, explanation];
        const sql = 'insert into foods(food, kind, explanation) values(?, ?, ?)';
        let conn;
        try {
            conn = await pool.getConnection();
            const [rows, metadata] = await conn.query(sql, data);
            conn.release();
            console.log('rows',rows);
            return rows[0];
        } catch (error) {
            console.error(error);
            return -1;
        } finally {
            if ( conn ) conn.release();
        }
    }

   
    
   
    updatefood = async(foodId, food, kind, explanation) => {
        const data = [food, kind, explanation ,foodId];
        const sql = 'update foods set food = ?, kind = ?, explanation = ?  where id = ?';
        let conn;
        try {
            conn = await pool.getConnection();
            const [rows, metadata] = await conn.query(sql, data);
            conn.release();
            console.log('rows',rows);
            return rows[0];
        } catch (error) {
            console.error(error);
            return -1;
        } finally {
            if ( conn ) conn.release();
        }
    }

  
    
   
    deleteFood = async(id) => {
        
        const sql = 'delete from foods where id = ?';
        let conn;
        try {
            conn = await pool.getConnection();
            const [rows, metadata] = await conn.query(sql, id);
            conn.release();
            console.log('rows',rows);
            return rows[0];
        } catch (error) {
            console.error(error);
            return -1;
        } finally {
            if ( conn ) conn.release();
        }
    }
}

module.exports = new Food();