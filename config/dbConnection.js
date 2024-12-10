// config/dbConnection.js
const mysql = require('mysql2');
const mariadb = require('mariadb');
const { Pool } = require('pg');
const dbConfig = require('./dbConfig');

class DBConnection {
  constructor() {
    this.connections = {};
  }

  // async connect(db_name) {
  //   const config = dbConfig[db_name];
  //   if (!config) {
  //     throw new Error(`Database configuration for db_name ${db_name} is not defined`);
  //   }

  //   // ลบ 'type' ออกจากการกำหนดค่าสำหรับไลบรารีฐานข้อมูล
  //   const type  = config['type'];
  //   const setting =
  //   {
  //     host: config['host'],
  //     user: config['user'],
  //     password: config['password'],
  //     database: config['database'],
  //     port: config['port']
  //   }
  //   console.log(setting)
  //   switch (type) {
  //     case 'mysql':
  //       if (!this.connections.db_name) {
  //         this.connections.db_name = mysql.createPool(setting);
  //         console.log('Connected to MySQL');
  //       }
  //       break;
  //     case 'mariadb':
  //       if (!this.connections.db_name) {
  //         this.connections.db_name = mariadb.createPool(setting);
  //         console.log('Connected to MariaDB');
  //       }
  //       break;
  //     case 'postgres':
  //       if (!this.connections.db_name) {
  //         this.connections.db_name = new Pool(setting);
  //         await this.connections.db_name.connect(); // เชื่อมต่อกับ PostgreSQL
  //         console.log('Connected to PostgreSQL');
  //       }
  //       break;
  //     default:
  //       throw new Error(`Unsupported database type: ${type}`);
  //   }
  // }
  async connect(db_name) {
    const config = dbConfig[db_name];
    if (!config) {
      throw new Error(`Database configuration for db_name ${db_name} is not defined`);
    }

    const type = config['type'];
    const setting = {
      host: config['host'],
      user: config['user'],
      password: config['password'],
      database: config['database'],
      port: config['port'],
    };

    console.log(`Attempting to connect to ${type} database:`, db_name);
    console.log(setting);

    switch (type) {
      case 'mysql':
        if (!this.connections[db_name]) { // ใช้ dynamic key
          this.connections[db_name] = mysql.createPool(setting);
          console.log(`Connected to MySQL (${db_name})`);
        }
        break;
      case 'mariadb':
        if (!this.connections[db_name]) {
          this.connections[db_name] = mariadb.createPool(setting);
          console.log(`Connected to MariaDB (${db_name})`);
        }
        break;
      case 'postgres':
        if (!this.connections[db_name]) {
          this.connections[db_name] = new Pool(setting);
          await this.connections[db_name].connect(); // เชื่อมต่อกับ PostgreSQL
          console.log(`Connected to PostgreSQL (${db_name})`);
        }
        break;
      default:
        throw new Error(`Unsupported database type: ${type}`);
    }
  }


  async executeQuery(db_name, sql, params = []) {
    const config = dbConfig[db_name];
    if (!config) {
      throw new Error(`Database configuration for db_name ${db_name} is not defined`);
    }
  
    const type = config['type']; // ระบุ type ของฐานข้อมูลจาก config
    const connection = this.connections[db_name]; // ใช้ db_name แทน type
    if (!connection) {
      throw new Error(`No connection found for database name: ${db_name}`);
    }
  
    try {
      switch (type) {
        case 'mysql':
        case 'mariadb':
          const [rows] = await connection.promise().query(sql, params);
          return rows;
        case 'postgres':
          const client = await connection.connect(); // รับ client ชั่วคราว
          try {
            const res = await client.query(sql, params);
            return res.rows;
          } finally {
            client.release(); // คืน client กลับไปที่ pool
          }
        default:
          throw new Error(`Unsupported database type for query: ${type}`);
      }
    } catch (err) {
      console.error(`Error executing query on ${type}:`, err);
      throw err;
    }
  }
  
  async closeConnections() {
    for (const [db_name, connection] of Object.entries(this.connections)) {
      const config = dbConfig[db_name];
      const type = config['type'];
  
      if (type === 'postgres') {
        if (connection) {
          try {
            await connection.end();
            console.log('PostgreSQL pool closed');
          } catch (err) {
            console.error('Error closing PostgreSQL pool:', err);
          }
        }
      } else if (type === 'mysql' || type === 'mariadb') {
        if (connection) {
          try {
            await connection.end();
            console.log(`${type} connection closed`);
          } catch (err) {
            console.error(`Error closing ${type} connection:`, err);
          }
        }
      }
    }
  }

}

module.exports = new DBConnection();
