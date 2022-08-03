const fs = require('fs');

function execute(args) {
    var dbName = args.dbName;
    var tableName = args.tableName;
    var dbPath = './databases/' + dbName;
    var tablePath = dbPath + '/' + tableName + '.json';
    if (fs.existsSync(dbPath)) {
        if (fs.existsSync(tablePath)) {
            var table = JSON.parse(fs.readFileSync(tablePath));
            return {
                success: true,  
                message: "Table found",
                data: table
            };
        } else {
            return {
                error: 'Table does not exist'
            };
        }
    }
    else {
        return {
            error: "Couldn't get a table in a database that doesn't exist"
        };
    }
}
module.exports = {
    execute: execute
}