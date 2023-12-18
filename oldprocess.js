
// process.js
class ProcessHandler {
    constructor(db) {
        this.db = db;
    }

    processValueQuery(code, data,status) {
        let sqlValues = [];
        let parsedData;
        if(status){
             parsedData = JSON.parse(data);
        }else{
             parsedData = data;
        }
        if (code === 'SQL0001') {
            sqlValues = [parsedData[0].name, parsedData[0].address];
        }
        else if (code === 'SQL0002') {
            sqlValues = [parsedData[0].name, parsedData[0].address, parsedData[0].id];
        } else if (code === 'SQL0003') {
            sqlValues = [parsedData.id];
        }
        return sqlValues;
    }

    processValueQuery(code, data,status) {
        let sqlValues = [];
        let parsedData;
        if(status){
             parsedData = JSON.parse(data);
        }else{
             parsedData = data;
        }
        if (code === 'SQL0001') {
            sqlValues = [parsedData[0].name, parsedData[0].address];
        }
        else if (code === 'SQL0002') {
            sqlValues = [parsedData[0].name, parsedData[0].address, parsedData[0].id];
        } else if (code === 'SQL0003') {
            sqlValues = [parsedData.id];
        }
        return sqlValues;
    }

    async handleGetRequest(req, res) {
        try {
            const sqlquery = req.query.sqlquery;
            const getQuery = this.processGetQuery(sqlquery);
            const result_data = await this.executeQuery(getQuery, [],true);

            res.json(result_data);
        } catch (error) {
            console.error('Error handling post request:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async handlePostRequest(req, res) {
        try {
            const apidata = req.body.apidata;
            const sqlquery = req.body.sqlquery;
            const getQuery = this.processGetQuery(sqlquery);
            const valueQuery = this.processValueQuery(sqlquery, apidata,true);
            const result_data = await this.executeQuery(getQuery, valueQuery,false);
            res.json({ status: 'Success', message: 'Successfully', result: result_data });
        } catch (error) {
            console.error('Error handling post request:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async handleUpdateRequest(req, res) {
        try {
            const apidata = req.body.apidata;
            const sqlquery = req.body.sqlquery;
            const getQuery = this.processGetQuery(sqlquery);
            const valueQuery = this.processValueQuery(sqlquery, apidata,true);
            const result_data = await this.executeQuery(getQuery, valueQuery,false);
            console.log(getQuery + ":" + valueQuery);
            res.json({ status: 'Success', message: 'Successfully', result: result_data });
        } catch (error) {
            console.error('Error handling post request:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async handleDeleteRequest(req, res) {
        try {
            const apidata = req.params;
            const sqlquery = req.query.sqlquery; 
            const getQuery = this.processGetQuery(sqlquery);
            const valueQuery = this.processValueQuery(sqlquery, apidata,false);
            const result_data = await this.executeQuery(getQuery, valueQuery,false);
            res.json({ status: 'Success', message: 'Successfully', result: result_data });
        } catch (error) {
            console.error('Error handling post request:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    executeQuery(query, values,status) {
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
