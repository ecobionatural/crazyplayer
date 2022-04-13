import server from './lib/server.js';
import WebSocket from 'ws';

const port = 3333;

;(async ()=>{

let file = process.argv[2] || '';

const ws = new WebSocket('ws://localhost:'+(port+1));
ws.on('open',()=>{
	cl('Socket opened');
	ws.send(JSON.stringify({cmd:'open_file',data:file}))
	ws.close();
});

ws.on('error',()=>{
	cl('Socket error');
	server(port);
})

})()
