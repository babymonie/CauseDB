#!/usr/bin/env node
const serverModule = require("./server");
const dashboardModule = require("./dashboard/config.js");
const program = require("commander");
program.name("CauseDB").version("0.0.1").description("A a ready to made json database with sql like queries");
program.command("start").description("Start the server").option("-p, --port <port>", "Port to listen on").option("-h, --host <host>", "Host to listen on").option("-dp, --dashboardpassword <dashboard password>", "Password to access the dashboard,default is 123").option("-du, --dashboardusername <dashboard username>", "Username to access the dashboard, default is admin").action(function(options) {
    var serverOptions = {
        port: options.port,
        host: options.host,
    };
    var dashboardOptions = {
        password: options.dashboardpassword,
        username: options.dashboardusername,
    }
    //check if port is specified and if it isn't then use the default port
    if (!options.port) {
        serverOptions.port = 3000;
    }
    //check if host is specified and if it isn't then use the default host
    if (!options.host) {
        serverOptions.host = "localhost";
    }
    //check if dashboard password is specified and if it isn't then use the default password
    if (!options.dashboardpassword) {
        dashboardOptions.password = "123";
    }
    //check if dashboard username is specified and if it isn't then use the default username
    if (!options.dashboardusername) {
        dashboardOptions.username = "admin";
    }
    //start the server
    serverModule.start(serverOptions);
    var pass = dashboardModule.encrypt(dashboardOptions.password);
    dashboardModule.set(dashboardOptions.username,pass);
    console.log("Dashboard set on username: " + dashboardOptions.username + " and password: " + dashboardOptions.password);
});
program.parse(process.argv);
if (program.args.length === 0) {
    program.help();
}