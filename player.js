import server from './lib/server.js';
import WebSocket from 'ws';

const port = 3333;

function initServer(file)
{
	const ws = new WebSocket('ws://localhost:'+(port+1));
	ws.on('open',()=>{
		cl('Socket opened');
		ws.send(JSON.stringify({cmd:'open_file',data:file.replace(/\\/g,'/')}))
		ws.close();
	});

	ws.on('error',async ()=>{
		cl('Socket error');
		server(port,()=>{
			initServer(file);
		});
	})
}

;(async ()=>{

let file = process.argv[2] || '';

initServer(file);

})()
