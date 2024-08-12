// config/dbConfig.js
require('dotenv').config();

const dbConfig = {
  default: {
    host: process.env.MYSQL_DB_HOST || 'localhost',
    user: process.env.MYSQL_DB_USER || 'root',
    password: process.env.MYSQL_DB_PASSWORD || '1234',
    database: process.env.MYSQL_DB_DATABASE || '',
    port: process.env.MYSQL_DB_PORT || 3306,
    type: 'mysql'
  },
  db_maria: {
    host: process.env.MARIADB_DB_HOST || 'localhost',
    user: process.env.MARIADB_DB_USER || 'root',
    password: process.env.MARIADB_DB_PASSWORD || '1234',
    database: process.env.MARIADB_DB_DATABASE || '',
    port: process.env.MARIADB_DB_PORT || 33061,
    type: 'mariadb'
  },
  api_postgres: {
    host: process.env.POSTGRES_DB_HOST || 'localhost',
    user: process.env.POSTGRES_DB_USER || 'postgres',
    password: process.env.POSTGRES_DB_PASSWORD || '1234',
    database: process.env.POSTGRES_DB_DATABASE || '',
    port: process.env.POSTGRES_DB_PORT || 5432,
    type: 'postgres'
  }
};

module.exports = dbConfig;
