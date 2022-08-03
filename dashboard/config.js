const fs = require("fs");
const dotenv = require("dotenv");
var md5 = require("md5");
dotenv.config();
//if your reading this your wondering why i didn't use the database your using right now,thats because im to lazy
//to make a database for this project, so i just used a json file
const secret = process.env.SECRET;
function encrypt(password) {
  var result = md5(password);
  return result;
}
function set(username, pass) {
  //read config.json file
  fs.readFile("./dashboard/config.json", "utf8", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      var config = JSON.parse(data);
      config.username = username;
      config.password = pass;
      var json = JSON.stringify(config);
      fs.writeFile("./dashboard/config.json", json, "utf8", function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}
function check(username,password,callback) {
    //read config.json file
    fs.readFile("./dashboard/config.json", "utf8", function (err, data) {
      if (err) {
        console.log(err);
      } else {
        var config = JSON.parse(data);
        var user = config.username;
        var pass = config.password;
        //check if username and password are correct
        if (username == user && encrypt(password) == pass) {
          callback(true);
        }
        else{
          callback(false);
        }
      }
    });
  }
function getUsername() {
  //read config.json file
  fs.readFile("./dashboard/config.json", "utf8", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      var config = JSON.parse(data);
      var user = config.username;
      return user;
    }
  });
}
module.exports = {
  encrypt: encrypt,
  check: check,
  set: set,
  secret: secret,
  getUsername: getUsername
};
