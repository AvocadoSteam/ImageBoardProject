const http = require('http');
const fs = require('fs').promises;

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
    console.log(req.url);
    console.log(p[1]);
    if (p[1] === "" || p[1] === "homepage.html") {
        getFile(res, "homepage.html", "text/html");
    }
    else if (p[1] === "image_list.html" || p[1] === "view_image.html") {
        getFile(res, p[1], "text/html");
    }
    else if (p[1] === "homepage.css" || p[1] === "image_list.css"|| p[1] === "view_image.css") {
        getFile(res, p[1], "text/css");
    }
    else if (p[1] === "script.js") {
        getFile(res, p[1], "text/javascript");
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write("<html><head></head><body><p>Oops! No content here.</p></body><html/>");
        res.end();
    }
}).listen(8080);

