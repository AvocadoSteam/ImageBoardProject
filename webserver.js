

const http = require('http');
const fs = require('fs').promises;
const url = require('url');
/*
NOTE:
    Used prof notes as reference for stuff below
 */

const getFile = (res, path, content_type) => {
    res.writeHead(200, {'Content-Type': content_type});
    fs.readFile(path)
        .then(content => res.write(content))
        .then(_ => res.end());
}

http.createServer((req, res) => {
    const p = req.url.split("/");
    console.log(req.url + "\trequest url");
    console.log(p[1] + "\tending of file");
    if (p[1] === "" || p[1] === "homepage.html") {
        getFile(res, "homepage.html", "text/html");
    }
    else if (p[1] === "image_list.html" || p[1] === "view_image.html") {
        getFile(res, p[1], "text/html");
    }
    else if (p[1] === "homepage.css" || p[1] === "image_list.css"|| p[1] === "view_image.css") {
        getFile(res, p[1], "text/css");
    }
    else if (p[1] === "script.js" || p[1] === "view_image.js") {
        getFile(res, p[1], "text/javascript");
    }
    /*
    else if (p[3].endsWith(".png")) {
        res.writeHead(200, {'Content Type': 'image/png'});
        res.end(p[3], 'binary')
    }
     */
    else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write("<html><head></head><body><p>Oops! No content here.</p></body><html/>");
        res.end();
    }

    if (req.method === "POST" && p[1] === "view_image") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            // Parse the JSON data from the request body
            try {
                const postData = JSON.parse(body);
                // Handle the contents here, e.g., store it in a database or do other processing
                console.log(postData.contents);

                // Respond with a success status and message
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify({status: "success", message: "Comment posted successfully"}));
            } catch (error) {
                // Handle any errors while parsing JSON or processing data
                console.error("Error occurred while processing POST request:", error);

                // Respond with an error status and message
                res.writeHead(500, {"Content-Type": "application/json"});
                res.end(JSON.stringify({status: "error", message: "Internal server error"}));
            }
        })
    }
}).listen(8080);

