const fs = require('fs');

function execute(args) {
    let dbName = args.dbName;
    let tableName = args.tableName;
    let dbPath = './databases/' + dbName;
    let tablePath = dbPath + '/' + tableName + '.json';
    if (fs.existsSync(dbPath)) {
        if (fs.existsSync(tablePath)) {
            fs.unlinkSync(tablePath);
            return {
                success: true,
                message: 'Table dropped'
            };
        } else {
            return {
                error: 'Table does not exist'
            };
        }
    } else {
        return {
            error: "Couldn't drop a table in a database that doesn't exist"
        };
    }
}
module.exports = {
    execute: execute
}