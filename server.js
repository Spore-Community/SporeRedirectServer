"use strict";
const http = require("http");
const https = require("https");
const fs = require("fs");


/** Server host name. */
const hostname = "0.0.0.0";

/** HTTPS certificates. */
const httpsOptions = {
    pfx: fs.readFileSync("spore.pfx"),
    passphrase: "spore",
    minVersion: "TLSv1"
}


/** HTTP Server */
http.createServer(onRequest).listen(80, hostname, function () {
    console.log((new Date()) + " HTTP server running at " + hostname + ":80");
});
https.createServer(httpsOptions, onRequest).listen(443, hostname, function () {
    console.log((new Date()) + " HTTPS server running at " + hostname + ":443");
});


function onRequest(request, response) {
    let path = request.url;
    writeLine(request.method + " " + path);

    if(path.length==1){
        response.writeHead(200);
        response.write("Connected to Spore redirect server");
        response.end();
        return;
    }

    let domain = path.includes("pollinator") ? "pollinator" : "community";

    response.writeHead(302, { "Location": "https://" + domain + ".spore.com" + path })
    response.end();
}


function writeLine(line) {
    console.log(line);
    fs.appendFile("log.txt", line + "\n", () => { });
}