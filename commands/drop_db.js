const fs = require('fs');

function execute(args) {
    let dbName = args.dbName;
    let dbPath = './databases/' + dbName;
    if (fs.existsSync(dbPath)) {
        fs.rmdirSync(dbPath);
        return {
            success: true,
            message: 'Database dropped'
        };
    } else {
        return {
            error: 'Database does not exist'
        };
    }
}
module.exports = {
    execute: execute
}