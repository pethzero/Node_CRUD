// config/dbConnection.js
const mysql = require('mysql2');
const mariadb = require('mariadb');
const { Pool } = require('pg');
const dbConfig = require('./dbConfig');

class DBConnection {
  constructor() {
    this.connections = {};
  }

  async connect(db_name) {
    const config = dbConfig[db_name];
    if (!config) {
      throw new Error(`Database configuration for db_name ${db_name} is not defined`);
    }
  
    // ลบ 'type' ออกจากการกำหนดค่าสำหรับไลบรารีฐานข้อมูล
    const { type, ...dbConfigWithoutType } = config;
  
    switch (type) {
      case 'mysql':
        if (!this.connections.mysql) {
          this.connections.mysql = mysql.createPool(dbConfigWithoutType);
          console.log('Connected to MySQL');
        }
        break;
      case 'mariadb':
        if (!this.connections.mariadb) {
          this.connections.mariadb = mariadb.createPool(dbConfigWithoutType);
          console.log('Connected to MariaDB');
        }
        break;
      case 'postgres':
        if (!this.connections.postgres) {
          this.connections.postgres = new Pool(dbConfigWithoutType);
          await this.connections.postgres.connect(); // เชื่อมต่อกับ PostgreSQL
          console.log('Connected to PostgreSQL');
        }
        break;
      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
  }
  
  

  async closeConnections() {
    for (const [type, connection] of Object.entries(this.connections)) {
      if (type === 'postgres') {
        try {
          await connection.end();
          console.log('PostgreSQL pool closed');
        } catch (err) {
          console.error('Error closing PostgreSQL pool:', err);
        }
      } else if (type === 'mysql') {
        connection.end(err => {
          if (err) {
            console.error('Error closing MySQL connection:', err);
          } else {
            console.log('MySQL connection closed');
          }
        });
      } else if (type === 'mariadb') {
        try {
          await connection.end();
          console.log('MariaDB pool closed');
        } catch (err) {
          console.error('Error closing MariaDB pool:', err);
        }
      }
    }
  }
  
}

module.exports = new DBConnection();
