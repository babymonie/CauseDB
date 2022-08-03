//imports
const express = require("express");
const compression = require("compression");
const io = require("socket.io");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const dashboardModule = require("./dashboard/config.js");
const bodyParser = require("body-parser");
//commands
const create_db = require("./commands/create_db");
const create_table = require("./commands/create_table");
const drop_table = require("./commands/drop_table");
const drop_db = require("./commands/drop_db");
const set = require("./commands/set");
const del = require("./commands/del");
const get = require("./commands/get");
const update = require("./commands/update");
const grab = require("./commands/grab");
const query = require("./commands/query");
function executeCommand(command, args) {
  switch (command.command) {
    case "create.db":
      return create_db.execute(args);
    case "create.table":
      return create_table.execute(args);
    case "drop.table":
      return drop_table.execute(args);
    case "drop.db":
      return drop_db.execute(args);
    case "set":
      return set.execute(args);
    case "del":
      return del.execute(args);
    case "get":
      return get.execute(args);
    case "update":
      return update.execute(args);
    case "grab":
      return grab.execute(args);
    case "query":
      return query.execute(args);
    default:
      return "Command not found";
  }
}
function log(message) {
  const logpath = "./logs/";
  var files = fs.readdirSync(logpath);
  var logfile = "";
  for (var i = 0; i < files.length; i++) {
    if (files[i].includes(".log")) {
      logfile = files[i];
    }
  }
  if (logfile == "") {
    fs.writeFileSync(logpath + "log.log", "");
    logfile = "log.log";
  }
  var log = fs.readFileSync(logpath + logfile, "utf8");
  //if the log is too long, create a new one
  if (log.length > 100000) {
    fs.writeFileSync(logpath + "log.log", "");
    logfile = "log" + Date.now() + ".log";
  }
  fs.writeFileSync(logpath + logfile, log + "\n" + message);
}

function listenForCommands(socket) {
  socket.on("command", function (command) {
    //log the miliseconds
    var miliseconds = new Date().getTime();
    var month = new Date().getMonth() + 1;
    log(
      "Command received: " +
        command.command.command +
        " " +
        command.args +
        " at " +
        miliseconds +
        " ms" +
        " on " +
        month +
        "/" +
        new Date().getDate() +
        "/" +
        new Date().getFullYear()
    );
    socket.emit(
      "command.result",
      executeCommand(command.command, command.command.args)
    );
    log(
      "Command executed: " +
        command.command.comamnd +
        " at " +
        miliseconds +
        "ms" +
        " on " +
        month +
        "/" +
        new Date().getDate() +
        "/" +
        new Date().getFullYear()
    );
  });
}
function parse(code) {
  let codeArray = code.split(" ");
  let command = codeArray[0];
  let args = codeArray.slice(1);
  switch (command) {
    case "create.db":
      var commandJSON = {
        command: {
          command: "create.db",
          args: {
            dbName: args[0],
          },
        },
      };
      return commandJSON;
    case "drop.db":
      var commandJSON = {
        command: {
          command: "drop.db",
          args: {
            dbName: args[0],
          },
        },
      };
      return commandJSON;
    case "create.table":
      var commandJSON = {
        command: {
          command: "create.table",
          args: {
            dbName: args[0],
            tableName: args[1],
          },
        },
      };
      return commandJSON;
    case "drop.table":
      var commandJSON = {
        command: {
          command: "drop.table",
          args: {
            dbName: args[0],
            tableName: args[1],
          },
        },
      };
      return commandJSON;
    case "set":
      var commandJSON = {
        command: {
          command: "get",
          args: {
            dbName: args[0],
            tableName: args[1],
            data: JSON.parse(args[3]),
          },
        },
      };
      return commandJSON;
    case "get":
      var commandJSON = {
        command: {
          command: "get",
          args: {
            dbName: args[0],
            tableName: args[1],
          },
        },
      };
      return commandJSON;
    case "grab":
      var commandJSON = {
        command: {
          command: "grab",
          args: {
            dbName: args[0],
            tableName: args[1],
            id: args[2],
          },
        },
      };
      return commandJSON;
    case "del":
      var commandJSON = {
        command: {
          command: "del",
          args: {
            dbName: args[0],
            tableName: args[1],
            id: args[2],
          },
        },
      };
      return commandJSON;
    case "update":
      var commandJSON = {
        command: {
          command: "update",
          args: {
            dbName: args[0],
            tableName: args[1],
            id: args[2],
            data: JSON.parse(args[3]),
          },
        },
      };
      return commandJSON;
    case "query":
      var commandJSON = {
        command: {
          command: "query",
          args: {
            dbName: args[0],
            tableName: args[1],
            query: args[2],
          },
        },
      };
      return commandJSON;
    default:
      return "Command not found";
  }
}
function start(options) {
  //check if the folder databases exists
  if (!fs.existsSync("./databases")) {
    fs.mkdirSync("./databases");
  }
  //start the server
  const app = express();
  const server = app.listen(
    options.port,
    options.host || "localhost",
    function () {
      console.log(
        `Server started on port ${options.port} and host ${
          options.host || "localhost"
        }`
      );
    }
  );
  server.on("error", function (err) {
    console.log(err);
  });
  app.use(
    express.static(path.join(__dirname, "dashboard"), {
      index: false,
      extensions: ["html"],
    })
  );
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set("view cache", true);
  app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "dashboard", "index.html"));
  });
  app.get("/play", function (req, res) {
    res.redirect("/dashboard/home");
  });
  app.get("/version", function (req, res) {
    //parse package.json
    var package = JSON.parse(fs.readFileSync("./package.json", "utf8"));
    res.send(package.version);
  });
  app.get("/logs", function (req, res) {
    var logpath = "./logs/";
    var files = fs.readdirSync(logpath);
    var logfile = "";
    for (var i = 0; i < files.length; i++) {
      if (files[i].includes(".log")) {
        logfile = files[i];
      }
    }
    if (logfile == "") {
      fs.writeFileSync(logpath + "log.log", "");
      logfile = "log.log";
    }
    var log = fs.readFileSync(logpath + logfile, "utf8");
    res.send(log);
  });
  app.post("/command", function (req, res) {
    var command = req.body;
    var parsedCommand = parse(command.command);
    var miliseconds = new Date().getTime();
    var month = new Date().getMonth() + 1;
    log(
      "Command received: " +
        parsedCommand.command.command +
        " " +
        parsedCommand.command.args +
        " at " +
        miliseconds +
        "ms" +
        " on " +
        month +
        "/" +
        new Date().getDate() +
        "/" +
        new Date().getFullYear()
    );
    res.send(executeCommand(parsedCommand.command, parsedCommand.command.args));
    log(
      "Command executed: " +
        parsedCommand.command.command +
        " at " +
        miliseconds +
        "ms" +
        " on " +
        month +
        "/" +
        new Date().getDate() +
        "/" +
        new Date().getFullYear()
    );
  });
  app.post("/auth", function (req, res) {
    var limit = req.body.limit;
    if (limit == false) {
      limit = "24";
    } else {
      limit = "730";
    }
    dashboardModule.check(req.body.username, req.body.password, function (
      result
    ) {
      if (result) {
        var token = jwt.sign(
          { username: req.body.username },
          dashboardModule.secret,
          { expiresIn: limit + "h", algorithm: "HS256" }
        );
        res.json({ token: token, success: true });
      } else {
        res.send("Invalid username or password");
      }
    });
  });
  app.post("/token", function (req, res) {
    var token = req.body.token;
    jwt.verify(token, dashboardModule.secret, function (err, decoded) {
      if (err) {
        res.json({
          malformed: true,
        });
      } else {
        if (decoded.username) {
          res.json({
            success: true,
            username: decoded.username,
          });
        } else {
          res.json({
            success: false,
          });
        }
      }
    });
  });
  app.post("/database", function (req, res) {
    var databases = fs.readdirSync("./databases");
    res.json({
      success: true,
      databases: databases,
    });
  });
  app.get("/stats/data", function (req, res) {
    var stats = [];
    var logpath = "./logs/";
    var files = fs.readdirSync(logpath);
    var logfile = "";
    for (var i = 0; i < files.length; i++) {
      if (files[i].includes(".log")) {
        logfile = files[i];
      }
    }
    if (logfile == "") {
      fs.writeFileSync(logpath + "log.log", "");
      logfile = "log.log";
    }
    var log = fs.readFileSync(logpath + logfile, "utf8");
    //parse the logs
    var lines = log.split("\n");
    var count = 1;
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].includes("Command received")) {
        var line = lines[i].split(" ");
        var date = line[8].split("/");
        var month = date[0];
        var day = date[1];
        var year = date[2];
        stats.push({
          date: month + "/" + day + "/" + year,
          count: count,
        });
        count++;
      }
    }
    res.json({
      success: true,
      stats: stats,
    });
  });
  //start the socket
  let socket = io(server);
  socket.on("connection", function (connection) {
    log("Connection from " + connection.id);
    connection.on("disconnect", function () {
      log("Connection from " + connection.id + " disconnected");
    });
    listenForCommands(connection, options);
  });
}

module.exports = {
  start: start,
};

//examples

//example command to begin
//create db test then create table users then set users.name = "John" , set users.age = "30"
//example command to get back data i1 will get all data from table users and 2 will get data from field name
//1. get users
//2. get users.name
//example command to delete data from table users
//delete users
//example command to update data in table users
//update users.name = "John" , users.age = "30"
//example command to list all tables in database
//list
//example command to query data from table users
//query users.name = "John"
