import {createApp} from './js/vue.esm.js';
import Player from './js/player.vue.mjs';

const port = 3333;
let ws;
let cur_file;

const instandce_id = Date.now();
localStorage.instandce_id = instandce_id;
setInterval(()=>{
	if(localStorage.instandce_id != instandce_id)
		window.close();
},100)


$(async ()=>{

//await initWebSocket(3334);

let app = createApp(Player).mount('body');

// await initWebSocket();
//
// let res = await send(ws,'read_filelist',{file:cur_file})
// cl({res});

})
