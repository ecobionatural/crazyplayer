import lib from './lib/lib.js';
import server from './lib/server.js';
import WebSocket from 'ws';

global.lib = lib;

c.port = 3333;
c.server_start = Date.now();
c.valid_exts = 'mp4,mpg,mpeg,avi,mkv,wmv,flv'.split(',');


function initServer(file)
{
	cl('init server')
	const ws = new WebSocket('ws://localhost:'+(c.port+1));
	ws.on('open',()=>{
		cl('Socket opened');
		ws.send(JSON.stringify({cmd:'open_file',data:file.replace(/\\/g,'/')}))
		ws.close();
	});

	ws.on('error',async ()=>{
		cl('Socket error');
		server(c.port,()=>{
			initServer(file);
		});
	})
}

;(async ()=>{

let file = process.argv[2] || 'h:/pvar/pkf/motherless/inside/motherless.com_Olive___ba_B7CB6E3_Olive___batgirl_superheroine_rape_Fuck_mouthshot_shooting_shot_dying_death_dead_big-tits.mp4';

initServer(file);

})()
