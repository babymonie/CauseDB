const fs = require('fs');

function execute(args) {
    var dbName = args.dbName;
    var tableName = args.tableName;

    var data = args.data;
    var dbPath = './databases/' + dbName;
    var tablePath = dbPath + '/' + tableName + '.json';
    if (fs.existsSync(dbPath)) {
        if (fs.existsSync(tablePath)) {
              var data = fs.readFileSync(tablePath);
                var data = JSON.parse(data);
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        data[key] = args.data[key];
                    }
                }
                fs.writeFileSync(tablePath, JSON.stringify(data));
                return {
                    success: true,
                    message: 'Table updated'
                };
        } else {
            return {
                error: 'Table does not exist'
            };
        }
    }
    else {
        return {
            error: "Couldn't update a table in a database that doesn't exist"
        };
    }
}
module.exports = {
    execute: execute
}