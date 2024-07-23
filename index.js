import http from 'http';
import fs from 'fs';
import path from 'path';
import ngrok from '@ngrok/ngrok';
const __dirname = path.resolve();
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
// Create webserver
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(html);
}).listen(8080, () => console.log('Node.js web server at 8080 is running...'));
// Get your endpoint online

(async function () {
  const listener = await ngrok.forward({
    addr: 8080,
    authtoken_from_env: true,
    domain: `starfish-meet-kid.ngrok-free.app`,
  });
  console.log(`Ingress established at: ${listener.url()}`);
})();
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
