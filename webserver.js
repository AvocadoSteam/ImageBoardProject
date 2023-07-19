const http = require('http');
const fs = require('fs').promises;
const url = require('url');

//TODO: create homepage

//TODO: create a page that displays a list of images based on a search request

//TODO: create a page that displays one image, with its related tags, and any comments.json attached to it

//TODO: implement "promises"

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

const saveComments = (response, image_id, name, comment) => {
    fs.writeFile("media/comments.json", `{
        "image_id": ${image_id},
        "name": "${name}",
        "post": "${comment}"
    }`).then(content => {
        const imageComments = JSON.parse(comment);
        imageComments.push(image_id, name, comment);
        console.log("IMAGE COMMENTS\t" + imageComments);
        return fs.writeFile("media/comments.json", JSON.stringify(imageComments));
    }).then(_ => {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write('{"success": "Comment added successfully"}');
        response.end();
    }).catch(_ => {
        response.writeHead(404, {'Content-Type': 'application/json'});
        response.write('{"error": "No topic for given ID"}');
        response.end();
    });
}

http.createServer((req, res) => {
    const p = req.url.split("/");
    console.log(req.url);
    console.log(p);
    console.log(p.length);
    if (p[1] === "" || p[1] === "homepage.html") {
        getFile(res, "homepage.html", "text/html");
    }
    else if (p[1] === "image_list.html" || p[1] === "view_image.html") {
        getFile(res, p[1], "text/html");
    }
    else if (p[1] === "homepage.css" || p[1] === "image_list.css"|| p[1] === "view_image.css") {
        getFile(res, p[1], "text/css");
    }
    else if (p[1] === "view_image.js") {
        getFile(res, p[1], "text/javascript");
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write("<html><head></head><body><p>Oops! No content here.</p></body><html/>");
        res.end();
    }

    if (req.method === "POST" && p[1] === "view_image.js") {
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

