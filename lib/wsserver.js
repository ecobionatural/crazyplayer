import WebSocket, { WebSocketServer } from 'ws';


import wsrouter from '../routers/ws.router.js';

export default (port,onready) => {

	let cur_file = '';

	const wss = new WebSocketServer({
		port: c.port+1,
		perMessageDeflate: {
		zlibDeflateOptions: {
			// See zlib defaults.
			chunkSize: 1024,
			memLevel: 7,
			level: 3
		},
		zlibInflateOptions: {
			chunkSize: 10 * 1024
		},
		// Other options settable:
		clientNoContextTakeover: true, // Defaults to negotiated value.
		serverNoContextTakeover: true, // Defaults to negotiated value.
		serverMaxWindowBits: 10, // Defaults to negotiated value.
		// Below options specified as default values.
		concurrencyLimit: 10, // Limits zlib concurrency for perf.
		threshold: 1024 // Size (in bytes) below which messages
		// should not be compressed if context takeover is disabled.
		}
	});

	wss.on('connection',ws=>{
		ws.on('message',async s => {
			cl({message:s+''});
			let d;
			try{
				d = JSON.parse(s);
				if(!d.cmd || d.data===undefined)
					throw 'Wrong data packet';
			}catch(e)
			{
				cl(e);
				throw e;
			}

			let res = {mid:d.mid};
			if(wsrouter[d.cmd])
			{
				Object.assign(res,await wsrouter[d.cmd](d.data))
				ws.send(JSON.stringify(res));
			}

		})
	});
	wss.on('listening',onready);

}
