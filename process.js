
// process.js
const SystemSql = require('./systemsql');

class ProcessHandler {
    constructor(db) {
        this.db = db;
    }

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
            // const result_data = await this.executeQuery(sqlQuery, sqlValues,false);
            // Update Commit RollBack
            const result_data = await this.executeQueryWithTransaction(sqlQuery, sqlValues, false);
            res.json({ status: 'Success', message: 'Successfully', result: result_data });
        } catch (error) {
            console.error('Error handling post request:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async handlePostRequestMutiple(req, res) {
        try {
            const sqlQuery = SystemSql.sqlsearch(req.body.sqlquery);
            res.send('All data inserted successfully.');
            const sqlValues = SystemSql.processValueQueryMultiple(req.body.sqlquery, req.body.apidata, true);

            const queries = sqlValues.map(item => {
                return {
                  query: sqlQuery,
                  values: item
                };
              });
              
            console.log(sqlQuery);
            console.log(sqlValues);
            console.log(queries);
        } catch (error) {
            console.error('Error handling post request:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async handleUpdateRequest(req, res) {
        try {
            const sqlQuery = SystemSql.sqlsearch(req.body.sqlquery);
            const sqlValues = SystemSql.processValueQuery(req.body.sqlquery, req.body.apidata, true);
            const result_data = await this.executeQuery(sqlQuery, sqlValues, false);
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
            const result_data = await this.executeQuery(sqlQuery, sqlValues, false);
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

    executeQueryWithTransaction(query, values, status) {
        return new Promise((resolve, reject) => {
            this.db.beginTransaction((err) => {
                if (err) {
                    reject(err);
                }

                const queryFunction = status ? this.db.query.bind(this.db, query) : this.db.query.bind(this.db, query, values);

                queryFunction((err, result) => {
                    if (err) {
                        // ถ้าเกิดข้อผิดพลาด ทำ Rollback และ Reject Promise
                        this.db.rollback(() => {
                            console.log('ROLLBACK');
                            reject(err);
                        });
                    } else {
                        // Commit Transaction และ Resolve Promise หาก query สำเร็จ
                        this.db.commit((err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                    }
                });
            });
        });
    }


    executeQueryWithTransactionMultiple(queries) {
        return new Promise((resolve, reject) => {
            this.db.beginTransaction((err) => {
                if (err) {
                    reject(err);
                }

                const performQuery = (query, values) => {
                    return new Promise((queryResolve, queryReject) => {
                        this.db.query(query, values, (err, result) => {
                            if (err) {
                                queryReject(err);
                            } else {
                                queryResolve(result);
                            }
                        });
                    });
                };

                const promises = queries.map(({ query, values }) => {
                    return performQuery(query, values);
                });

                Promise.all(promises)
                    .then((results) => {
                        this.db.commit((err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(results);
                            }
                        });
                    })
                    .catch((error) => {
                        this.db.rollback(() => {
                            console.log('ROLLBACK');
                            reject(error);
                        });
                    });
            });
        });
    }

}

module.exports = ProcessHandler;
