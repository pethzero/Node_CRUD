const fs = require('fs');
const path = require('path');
// systemsql.js
class SystemSql {
  static DBQueries = {
    'SQL0000': 'SELECT * FROM employees',
    'SQL0001': 'INSERT INTO employees (name, score) VALUES (?, ?)',
    'SQL0002': 'UPDATE employees SET name = ?, score = ? WHERE id = ?',
    'SQL0003': 'DELETE FROM employees WHERE id = ?',
    'SQL0004': 'INSERT INTO employees (grade) VALUES (?)', // New SQL query
    'SQL0005': 'UPDATE employees SET grade = ? WHERE id = ?',
  };

  static DBValues = {
    'SQL0001': ['name', 'score'],
    'SQL0002': ['name', 'score', 'id'],
    'SQL0003': ['id'],
    'SQL0004': ['grade'], // Corresponding values for the new SQL query
    'SQL0005': ['grade', 'id'], // Corresponding values for the new SQL query
    ////////////////////////////////////////////////////////////////////
    'MCQ0001': ['name', 'score'],
    'MCQ0002': ['name', 'score', 'id'],
    'MCQ0003': ['id'],
    'MCQ0004': ['grade'], // Corresponding values for the new SQL query
    'MCQ0005': ['grade', 'id'], // Corresponding values for the new SQL query
  };

  static sqlsearch(code) {
    return SystemSql.DBQueries[code] || '';
  }


  static processValueQueryArray(code, condition, data, status) {
    const sqlValuesArray = [];
    const valueKeys = SystemSql.DBValues[condition];
    if (valueKeys) {
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(item => {
          const sqlValues = valueKeys.map(key => item[key]);
          sqlValuesArray.push({ query: SystemSql.DBQueries[code], values: sqlValues });
        });
      }
    }
    return sqlValuesArray;
  }

  static generateQueriesAndValues(data) {
    const queriesAndValues = [];

    data.forEach(item => {
      const code = item.query;
      const processedValues = SystemSql.processValueQueryArray(code, item.condition, item.listdata, true);
      queriesAndValues.push(...processedValues);
    });
    return queriesAndValues;
  }
  
  static processValueQuery(code, data, status) {
    let sqlValues = [];
    let parsedData;
    const valueKeys = SystemSql.DBValues[code];

    if (valueKeys) {
      if (status) {
        parsedData = JSON.parse(data);
        sqlValues = valueKeys.map(key => parsedData[0][key]);
      } else {
        parsedData = data;
        sqlValues = valueKeys.map(key => parsedData[key]);
      }

    }
    return sqlValues;
  }

  static processValueQueryMultiple(code, data, status) {
    const sqlValuesArray = [];
    const valueKeys = SystemSql.DBValues[code];

    if (valueKeys) {
      let parsedDataArray;

      if (status) {
        parsedDataArray = JSON.parse(data);
      } else {
        parsedDataArray = data;
      }

      if (Array.isArray(parsedDataArray) && parsedDataArray.length > 0) {
        parsedDataArray.forEach(parsedData => {
          const sqlValues = valueKeys.map(key => parsedData[key]);
          sqlValuesArray.push(sqlValues);
        });
      }
    }

    return sqlValuesArray;
  }
  ////////////////////////////// PROCESS NEW /////////////////////////////////////


  static async upload(file) {
    try {
      const newPath = path.join(file.destination, file.originalname);
      if (fs.existsSync(newPath)) {
        fs.unlinkSync(newPath);
      }
      fs.renameSync(file.path, newPath);
      file.path = newPath;
      return { status: 'suscess', message: 'File uploaded successfully', file };
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }

  static async processUpload(req) {
    try {
      if (!req.file) {
        return { status: 'error', message: 'No file provided' };
      }
      const result = await this.upload(req.file);
      return result;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }
  static async processUploadMultiple(req) {
    try {
      // เช็คว่ามีไฟล์ถูกส่งมาหรือไม่
      if (!req.files || req.files.length === 0) {
        return { status: 'error', message: 'No files provided' };
      }
      const files = req.files;
      const results = [];
      for (const file of files) {
        const result = await this.upload(file);
        results.push(result);
      }
      return results;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }


  // static async processUploadFields(req) {
  //   try {
  //     const filesX = req.files['fileX'];
  //     const filesY = req.files['fileY'];
  //     const results = [];

  //     if (filesX) {
  //       for (const file of filesX) {
  //         const result = await this.upload(file);
  //         results.push(result);
  //       }
  //     }

  //     if (filesY) {
  //       for (const file of filesY) {
  //         const result = await this.upload(file);
  //         results.push(result);
  //       }
  //     }

  //     return results;
  //   } catch (error) {
  //     throw new Error('Internal Server Error');
  //   }
  // }

  static async processUploadFields(req) {
    try {
      const fileResults = [];
      const fieldKeys = Object.keys(req.files);
      for (const key of fieldKeys) {
        const files = req.files[key];
        // เช็คว่ามีไฟล์ถูกส่งมาหรือไม่ในแต่ละ field
        if (files && files.length > 0) {
          for (const file of files) {
            const result = await this.upload(file);
            fileResults.push(result);
          }
        }
      }
      return fileResults;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }




  ///////////////////////////////////////////////////////////////////////////////
}

module.exports = SystemSql;
