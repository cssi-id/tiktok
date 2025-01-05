const http = require('http');
const Tiktok = require('@tobyg74/tiktok-api-dl');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/download') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', async () => {
            try {
                const { url } = JSON.parse(body);
                const result = await Tiktok.Downloader(url, {
                    version: 'v3',
                    proxy: '',
                    showOriginalResponse: true,
                });

                if (result && result.result) {
                    const videoUrl = result.result.videoSD || result.result.videoHD || result.result.videoWatermark;

                    if (videoUrl) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ videoUrl }));
                    } else {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'No video URL found' }));
                    }
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Video not found' }));
                }
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to download TikTok video', details: error.message }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>Not Found</h1>');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
