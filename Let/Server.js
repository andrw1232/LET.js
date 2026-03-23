import http from 'node:http';

const hostname = '127.0.0.1';
const port = 8080;
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><body><h1>hello world</h1></body></html>');
    res.end();
    
});

server.listen(port, hostname, () => {
    console.log(`server is running at http://${hostname}:${port}`);
});