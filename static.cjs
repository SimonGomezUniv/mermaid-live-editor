const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const DIRECTORY = path.join(__dirname, 'docs');

const server = http.createServer((req, res) => {
    const filePath = path.join(DIRECTORY, req.url === '/' ? 'index.html' : req.url);
    console.log(filePath)
    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.statusCode = 404;
            res.end('File not found');
            return;
        }

        if (stats.isDirectory()) {
            res.statusCode = 403;
            res.end('Access denied');
            return;
        }

        const stream = fs.createReadStream(filePath);
        stream.on('error', () => {
            res.statusCode = 500;
            res.end('Internal server error');
        });
        res.statusCode = 200;
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`Static server running at http://localhost:${PORT}/`);
});
