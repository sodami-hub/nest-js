import http from "http";

http.createServer((req, res) => {
    console.log(req.url, req.headers.cookie);
    res.writeHead(200, { "set-cookie": "name=le" });
    res.end("Hello Cookie");
}).listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
});