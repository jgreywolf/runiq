import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;

const server = createServer((req, res) => {
	// Serve a simple HTML page that renders SVG
	if (req.url === '/' || req.url === '/index.html') {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Runiq Visual Test Server</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		body {
			font-family: system-ui, -apple-system, sans-serif;
			background: white;
		}
		#svg-container {
			padding: 20px;
		}
		svg {
			display: block;
			margin: 0 auto;
		}
	</style>
</head>
<body>
	<div id="svg-container"></div>
	<script>
		// Render SVG passed via URL parameter
		const params = new URLSearchParams(window.location.search);
		const svgContent = params.get('svg');
		if (svgContent) {
			document.getElementById('svg-container').innerHTML = decodeURIComponent(svgContent);
		}
	</script>
</body>
</html>
		`);
		return;
	}
	
	// Health check endpoint
	if (req.url === '/health') {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ status: 'ok' }));
		return;
	}
	
	res.writeHead(404);
	res.end('Not found');
});

server.listen(PORT, () => {
	console.log(`Visual test server running at http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
	console.log('SIGTERM received, closing server...');
	server.close(() => {
		console.log('Server closed');
		process.exit(0);
	});
});
