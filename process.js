
// process.js
const SystemSql = require('./systemsql');
class ProcessHandler 
  {
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
                    // console.log(queriesAndValues);
                    const result_data = await this.exeCommitDB(queriesAndValues); 
                    console.log(result_data)
                    ////////////////////////////////////////////////////
                    this.db.commit((err) => {
                        if (err) {
                            this.db.rollback(() => {
                                res.status(500).json({r_result:result_data, status: 'Error', message: 'Transaction Commit Error', error: err });
                            });
                        } else {
                            res.json({ r_result:result_data,status: 'Suscess', message: 'Transaction Committed Successfully' })
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
    /////////////////////////////////////////////    PROCESS V.2   ////////////////////////////////////////////////////////////
    // 19/01/2567
    async handleRequestProcessV2(req, res) {
        try {
            const DataJson = req.body.apidata; // ดึงข้อมูลตามที่ส่งมา โดย Key apidata
            const parsedData = JSON.parse(DataJson);
            console.log(parsedData)
            const queriesAndValues = SystemSql.generateQueriesAndValues(parsedData);

            this.db.beginTransaction(async (err) => {
                if (err) {
                    return res.status(500).json({ status: 'Error', message: 'Transaction Begin Error', error: err });
                }
                try {
                    ////////////////////// execute //////////////////////
                    parsedData.forEach(item => {
                        // ทำสิ่งที่คุณต้องการกับแต่ละ data ที่ได้จาก array
                        const process_method = item.method;
                        // console.log("process_method",process_method);
                        switch (process_method) {
                            case "GET":
                                console.log(item)
                                // console.log(SystemSql.generateQueriesAndValues(item))
                                // code block
                                break;
                            case y:
                                // code block
                                break;
                            default:
                            // code block
                        }
                    });


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
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async handleRequestProcess_M(req, res) {
        try {
            var data_result;
            const DataJson = req.body.apidata; // ดึงข้อมูลตามที่ส่งมา โดย Key apidata
            const parsedData = JSON.parse(DataJson);
            //const queriesAndValues = SystemSql.generateQueriesAndValues(parsedData);
            const queriesAndValues = SystemSql.GenerateQuery_M(parsedData);
            this.db.beginTransaction(async (err) => {
                if (err) {
                    return res.status(500).json({ status: 'Error', message: 'Transaction Begin Error', error: err });
                }
                try {
                    ////////////////////// execute //////////////////////
                    console.log("DATA" + queriesAndValues);
                    // // const queries =
                    // //     [
                    // //         {
                    // //             query: "INSERT INTO employees (name, score) VALUES (?,?)",
                    // //             values: ["A", 10]
                    // //         }
                    // //     ];

                    // // await this.exeCommitDB(queries); /// มีแผนเปลี่ยนใหม่

                    const queries =
                        [
                            {
                                // query: "INSERT INTO employees (name, score) VALUES ?",
                                query: "UPDATE employees SET grade = ? WHERE id = ?",
                                // values: ['A', 15]
                                values: [['A', 15],['B',16]]
                                    
                            }
                        ];
                    // const result_data = await this.exeCommitDB(queries); 
                    const result_data = await this.exeCommitDB_M(queries); 
                    
                    console.log(result_data);
                    // console.log("DATA"+queriesAndValues);
                    ////////////////////////////////////////////////////
                    this.db.commit((err) => {
                        if (err) {
                            this.db.rollback(() => {
                                res.status(500).json({result:result_data, status: 'Error', message: 'Transaction Commit Error', error: err });
                            });
                        } else {
                            res.json({ result:result_data,status: 'Suscess', message: 'Transaction Committed Successfully' })
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

    ///////////////////// (Process ใหม่) /////////////////////
    exeCommitDB(queriesAndValues) {
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
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    ////////////////////////////////////////////////////////////
    exeCommitDB_M(queriesAndValues) {
        return new Promise((resolve, reject) => {

            const performQuery = (query, values) => {
                return new Promise((queryResolve, queryReject) => {
                    this.db.query(query, [values], (err, result) => {
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
                .then((results) => {
                    resolve(results);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

}
module.exports = ProcessHandler;