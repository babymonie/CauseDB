const fs = require('fs');

function generateId() {
    return Math.floor(Math.random() * 1000000);
}
function execute(args) {
    var dbName = args.dbName;
    var tableName = args.tableName;

    var data = args.data;
    var json = {
        id: generateId(),
        data: data
    };
    var dbPath = './databases/' + dbName;
    var tablePath = dbPath + '/' + tableName + '.json';
    if (fs.existsSync(dbPath)) {
        if (fs.existsSync(tablePath)) {
           //write json inside [] brackets
            var table = fs.readFileSync(tablePath);
            table = JSON.parse(table);
            table.push(json);
            fs.writeFileSync(tablePath, JSON.stringify(table));
            return {
                success: true,
                message: 'Record added',
                id: json.id
            };
        } else {
            return {
                error: 'Table does not exist'
            };
        }
    }
    else {
        return {
            error: "Couldn't set a table in a database that doesn't exist"
        };
    }
}
module.exports = {
    execute: execute
}