const fs = require('fs');

function execute(args) {
    var dbName = args.dbName;
    var tableName = args.tableName;
    var id = args.id;
    var dbPath = './databases/' + dbName;
    var tablePath = dbPath + '/' + tableName + '.json';
    if (fs.existsSync(dbPath)) {
        if (fs.existsSync(tablePath)) {
            var table = fs.readFileSync(tablePath);
            table = JSON.parse(table);
            var row = table.find(function (row) {
                return row.id == id;
            });
            if (row) {
                table.splice(table.indexOf(row), 1);
                fs.writeFileSync(tablePath, JSON.stringify(table));
                return {
                    success: true,
                    message: 'Record deleted'
                };
            }
            return {
                success: false,
                message: 'Record not found'
            };
        } else {
            return {
                success: false,
                message: "Table not found"
            };
        }
    } else {
        return {
            success: false,
            message: "Database not found"
        };
    }
}
module.exports = {
    execute: execute
}