const http = require('http');
const url = require("url");
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');

// https://stackoverflow.com/questions/50441000/include-css-and-js-files-in-node-js
app.use(express.static(__dirname + '/public'));
/*
BELOW:
    - Basic creation of server
    - Has homepage & 2 buttons; allows user to move to two pages
RESOURCE USED --- https://www.w3schools.com/nodejs/nodejs_url.asp
 */
http.createServer(function (req, res) {
    const q = url.parse(req.url, true);
    const file_name = "." + q.pathname;
    fs.readFile(file_name, function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'})
            return res.end("404 Not Found");
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(8080);

