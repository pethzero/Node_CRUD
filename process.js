
// process.js
const SystemSql = require('./systemsql');
class ProcessHandler {
    constructor(db) {
        this.db = db;
    }
    //////////////////////////////////////////////    OLD  /////////////////////////////////////////////////////////////////
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
            const result_data = await this.executeQueryWithTransaction(sqlQuery, sqlValues, false);
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
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////// Mutiple OLD  ////////////////////////////////////////////////////////////
    async handleUpdateRequestMutiple(req, res) {
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
        } catch (error) {
            console.error('Error handling post request:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////    Mutiple NEW   ////////////////////////////////////////////////////////////
    async handleRequestProcess(req, res) {
        try {
            const DataJson = req.body.apidata; // ดึงข้อมูลตามที่ส่งมา โดย Key apidata
            const parsedData = JSON.parse(DataJson);
            const queriesAndValues = SystemSql.generateQueriesAndValues(parsedData);
            this.db.beginTransaction(async (err) => {
                if (err) {
                    return res.status(500).json({ status: 'Error', message: 'Transaction Begin Error', error: err });
                }
                try {
                    ////////////////////// execute //////////////////////
                    await this.executeWithTransactionNew(queriesAndValues);
                    ////////////////////////////////////////////////////
                    this.db.commit((err) => {
                        if (err) {
                            this.db.rollback(() => {
                                res.status(500).json({ status: 'Error', message: 'Transaction Commit Error', error: err });
                            });
                        } else {
                            res.json({ status: 'Suscess', message: 'Transaction Committed Successfully' })
                        }
                    });
                } catch (error) {
                    this.db.rollback(() => {
                        res.status(500).json({ status: 'Error', message: 'Error during transaction', error: error });
                    });
                }
            });

        } catch (error) {
            console.error('Error handling post request:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /////////////////////////////////////////////    Upload    ////////////////////////////////////////////////////////////
    async handleRequestUpload(req, res) {
        try {
            console.log(req.file)
            const result = await SystemSql.processUpload(req);
            res.json(result);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
    async handleRequestUploadMultiple(req, res) {
        try {
            const results = await SystemSql.processUploadMultiple(req);
            res.json(results);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
    async handleRequestUploadField(req, res) {
        try {
            const results = await SystemSql.processUploadFields(req);
            res.json(results);
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

                Promise.all(promises).then((results) => {
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
                            reject(error);
                        });
                    });
            });
        });
    }
    executeWithTransactionNew(queriesAndValues) {
        return new Promise((resolve, reject) => {

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

            const promises = queriesAndValues.map(({ query, values }) => {
                return performQuery(query, values);
            });

            Promise.all(promises)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
module.exports = ProcessHandler;