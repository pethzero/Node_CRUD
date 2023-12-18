
// process.js
const SystemSql = require('./systemsql');

class ProcessHandler {
    constructor(db) {
        this.db = db;
    }

    // processGetQuery(code) {
    //     sqlsearch(code)
    //     return sqlQuery;
    // }

    // processValueQuery(code, data, status) {
    //     let sqlValues = [];
    //     let parsedData;
    //     if (status) {
    //         parsedData = JSON.parse(data);
    //     } else {
    //         parsedData = data;
    //     }
    //     if (code === 'SQL0001') {
    //         sqlValues = [parsedData[0].name, parsedData[0].address];
    //     }
    //     else if (code === 'SQL0002') {
    //         sqlValues = [parsedData[0].name, parsedData[0].address, parsedData[0].id];
    //     } else if (code === 'SQL0003') {
    //         sqlValues = [parsedData.id];
    //     }
    //     return sqlValues;
    // }

    async handleGetRequest(req, res) {
        try {
            const sqlQuery = SystemSql.sqlsearch(req.query.sqlquery);
            const result_data = await this.executeQuery(sqlQuery, [], true);

            res.json(result_data);
        } catch (error) {
            console.error('Error handling post request:', error);
            res.status(500).send('Internal Server Error');
        }
    }



    async handlePostRequest(req, res) {
        try {
            const sqlQuery = SystemSql.sqlsearch(req.body.sqlquery);
            const sqlValues = SystemSql.processValueQuery(req.body.sqlquery, req.body.apidata, true);
            const result_data = await this.executeQuery(sqlQuery, sqlValues,false);
            res.json({ status: 'Success', message: 'Successfully', result: result_data });
        } catch (error) {
            console.error('Error handling post request:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async handleUpdateRequest(req, res) {
        try {
            const sqlQuery = SystemSql.sqlsearch(req.body.sqlquery);
            const sqlValues = SystemSql.processValueQuery(req.body.sqlquery, req.body.apidata, true);
            const result_data = await this.executeQuery(sqlQuery, sqlValues,false);
            res.json({ status: 'Success', message: 'Successfully', result: result_data });
        } catch (error) {
            console.error('Error handling post request:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async handleDeleteRequest(req, res) {
        try {
            const sqlQuery = SystemSql.sqlsearch(req.query.sqlquery);
            const sqlValues = SystemSql.processValueQuery(req.query.sqlquery, req.params, false);
            const result_data = await this.executeQuery(sqlQuery, sqlValues,false);
            res.json({ status: 'Success', message: 'Successfully', result: result_data });
        } catch (error) {
            console.error('Error handling post request:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    executeQuery(query, values, status) {
        return new Promise((resolve, reject) => {
            if (status) {
                this.db.query(query, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            } else {
                this.db.query(query, values, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    }
}

module.exports = ProcessHandler;
