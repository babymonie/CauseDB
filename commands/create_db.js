const fs = require('fs');

function execute(args) {
    let dbName = args.dbName;
    let dbPath = './databases/' + dbName;
    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath);
        return {
            success: true,
            message: 'Database created'
        };
    } else {
        return {
            error: 'Database already exists'
        };
    }
}
module.exports = {
    execute: execute
}