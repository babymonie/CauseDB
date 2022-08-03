const fs = require('fs');

function execute(args) {
    var dbName = args.dbName;
    var tableName = args.tableName;
    var dbPath = './databases/' + dbName;
    var tablePath = dbPath + '/' + tableName + '.json';

    var id = args.id;

    if (fs.existsSync(dbPath)) {
        if (fs.existsSync(tablePath)) {
            var table = fs.readFileSync(tablePath);
            table = JSON.parse(table);
            var row = table.find(function (row) {
                return row.id == id;
            });
            if (row) {
                return {
                    success: true,
                    message: 'Record found',
                    data: row
                };
            }
            return {
                success: false,
                message: 'Record not found'
            };
        } else {
            return {
                error: 'Table does not exist'
            };
        }
    }
    else {
        return {
            error: "Couldn't grab a table in a database that doesn't exist"
        };
    }
}
module.exports = {
    execute: execute
}