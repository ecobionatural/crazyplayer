import lib from './lib/lib.js';
import server from './lib/server.js';
import WebSocket from 'ws';
import fetch from 'node-fetch';
global.lib = lib;

c.port = 3333;
c.server_start = Date.now();


async function initServer(file)
{
	cl('init server')
	// const ws = new WebSocket('ws://localhost:'+(c.port+1));
	// ws.on('open',()=>{
	// 	cl('Socket opened');
	// 	ws.send(JSON.stringify({cmd:'open_file',data:file.replace(/\\/g,'/')}))
	// 	ws.close();
	// });
	//
	// ws.on('error',async ()=>{
	// 	cl('Socket error');
	// 	server(c.port,()=>{
	// 		initServer(file);
	// 	});
	// })

	try{
		let res = await fetch('http://localhost:'+(c.port)+'/api/open_file',
			{
				headers: {
	 				'Content-Type': 'application/json'
				},
				method:'POST',
				body: JSON.stringify({file:file.replace(/\\/g,'/')})
			}
		);
	}catch(e)
	{
		server(c.port,()=>{
			initServer(file);
		});
	}


}

;(async ()=>{

let file = process.argv[2] || '';

await initServer(file);

})()
