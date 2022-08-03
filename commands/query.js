const fs = require("fs");
const Enumerable = require('linq')
function execute(args) {
  var dbName = args.dbName;
  var tableName = args.tableName;
  var dbPath = "./databases/" + dbName;
  var tablePath = dbPath + "/" + tableName + ".json";
  var query = args.query;
  if (fs.existsSync(dbPath)) {
    if (fs.existsSync(tablePath)) {
      var data = JSON.parse(fs.readFileSync(tablePath));
      var result = Enumerable.default.from(data).where(query).toArray();
      return {
        success: true,
        message: result,
      };
    }
    else {
        return "Table does not exist";
        }
    }
    else {
        return "Database does not exist";
        }
}
module.exports = {
  execute: execute,
};
