const fs = require('fs');

function execute(args) {
    let dbName = args.dbName;
    let tableName = args.tableName;
    let dbPath = './databases/' + dbName;
    let tablePath = dbPath + '/' + tableName + '.json';
    if (fs.existsSync(dbPath)) {
        if (!fs.existsSync(tablePath)) {
            fs.writeFileSync(tablePath, '[]');
            return {
                success: true,
                message: 'Table created'
            };
        } else {
            return {
                error: 'Table already exists'
            };
        }
    } else {
        return {
            error: "Couldn't create a table in a database that doesn't exist"
        };
    }
}
module.exports = {
    execute: execute
}