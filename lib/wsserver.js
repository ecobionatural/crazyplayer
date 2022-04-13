import WebSocket, { WebSocketServer } from 'ws';
import open from 'open';
import {dirname} from 'path';
import {readdirSync} from 'fs';

export default (port,onready) => {

	let cur_file = '';

	const wss = new WebSocketServer({
		port: port+1,
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
		ws.on('message',s => {
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

			const cmds = {
				ping(){
					return {cur_file}
				},
				open_file(d){
					cl('Opening file '+d)
					if(d)
						cur_file = d;
						open('http://localhost:'+port+'/#'+d);
				},
				get_folder_files(d){
					//let dir = dirname(d.file);
					let ff = readdirSync(d.dir);
					let rex = new RegExp(`\\.(${c.valid_exts.join('|')})$`);

					return {files:ff.filter(f=>rex.test(f))};
				}
			}

			let res = {};
			if(cmds[d.cmd])
				res = cmds[d.cmd](d.data)

			ws.send(JSON.stringify(res));

		})
	});
	wss.on('listening',onready);

}
