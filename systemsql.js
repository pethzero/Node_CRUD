// systemsql.js
class SystemSql {
    static DBQueries = {
        'SQL0000': 'SELECT * FROM employees',
        'SQL0001': 'INSERT INTO employees (name, address) VALUES (?, ?)',
        'SQL0002': 'UPDATE employees SET name = ?, address = ? WHERE id = ?',
        'SQL0003': 'DELETE FROM employees WHERE id = ?',
    };



    static sqlsearch(code) {
        return SystemSql.DBQueries[code] || '';
    }


    static DBValues = {
        'SQL0001': ['name', 'address'],
        'SQL0002': ['name', 'address', 'id'],
        'SQL0003': ['id'],
    };

    static processValueQuery(code, data, status) {
        let sqlValues = [];
        let parsedData;
        const valueKeys = SystemSql.DBValues[code];

        if(valueKeys){
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
}

module.exports = SystemSql;