const fs = require("fs");
const http = require("http");
const server = http.createServer();

server.on("request", (req, res) => {
    const filePath = `images${req.url}`; // Dynamically get the file path from the request

    fs.createReadStream(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            return res.end("Error reading file");
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});

server.listen(8080, "127.0.0.1");
console.log("server running");
