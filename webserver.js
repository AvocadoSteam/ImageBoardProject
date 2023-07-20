// server.js

const http = require('http');
const fs = require('fs').promises;
const url = require('url');

const createCommentsFileIfNotExists = async () => {
    try {
        await fs.access("comments.json");
    } catch (error) {
        console.log("Creating comments.json file...");
        await fs.writeFile("comments.json", JSON.stringify({ comments: [] }));
        console.log("comments.json file created.");
    }
}

const getComments = async () => {
    try {
        const content = await fs.readFile("comments.json");
        return JSON.parse(content);
    } catch (error) {
        console.error("Error reading comments:", error);
        return { comments: [] };
    }
}

const saveComments = async (comments) => {
    try {
        await fs.writeFile("comments.json", JSON.stringify({ comments }));
    } catch (error) {
        console.error("Error saving comments:", error);
    }
}

const getFile = async (res, path, content_type) => {
    res.writeHead(200, { 'Content-Type': content_type });
    try {
        const content = await fs.readFile(path);
        res.write(content);
        res.end();
    } catch (error) {
        console.error("Error reading file:", error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.write("<html><head></head><body><p>Oops! Something went wrong.</p></body><html/>");
        res.end();
    }
}

const getImages = async () => {
    try {
        const content = await fs.readFile("images.json");
        return JSON.parse(content);
    } catch (error) {
        console.error("Error reading comments:", error);
        return { images: [] };
    }
}

http.createServer(async (req, res) => {
    await createCommentsFileIfNotExists();

    const p = req.url.split("/");
    console.log(req.url);
    if (p[1] === "" || p[1] === "homepage.html") {
        getFile(res, "homepage.html", "text/html");
    }
    else if (p[1] === "image_list.html" || p[1] === "view_image.html") {
        getFile(res, p[1], "text/html");
    }
    else if (p[1] === "homepage.css" || p[1] === "image_list.css" || p[1] === "view_image.css") {
        getFile(res, p[1], "text/css");
    }
    else if (p[1] === "view_image.js" || p[1] === "image_list.js" || p[1] === "homepage.js") {
        getFile(res, p[1], "text/javascript");
    }
    else if (p[1] === "comments.json") {
        const { comments } = await getComments();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ comments }));
    }
    else if (p[1] === "images.json") {
        const { images } = await getImages();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ images }));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write("<html><head></head><body><p>Oops! No content here.</p></body><html/>");
        res.end();
    }

    // RETRIEVE IMAGE
    if (req.method === "GET" && p[1] === "view_image.js") {

    }

    // POST COMMENTS
    if (req.method === "POST" && p[1] === "view_image.js") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            try {
                const postData = JSON.parse(body);

                // https://developer.mozilla.org/en-US/docs/web/api/document/cookie
                const getImageIDCookie = document.cookie
                    .split(";")
                    .find((row) => row.startsWith("image_id="))?.split("=")[1];

                const userName = postData.name;
                const comment = postData.contents;

                const { comments } = await getComments();

                comments.push({ image_id: getImageIDCookie, name: userName, text: comment });

                console.log(comments);

                await saveComments(comments);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ status: "success", message: "Comment posted successfully" }));
            } catch (error) {
                console.error("Error occurred while processing POST request:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ status: "error", message: "Internal server error" }));
            }
        });
    }
}).listen(8080, () => {
    console.log("Server running on http://localhost:8080/");
});
