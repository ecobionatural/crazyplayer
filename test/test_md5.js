
import md5 from 'md5-file';
import fs from 'fs';


(async ()=>{
	let start = Date.now();
	console.log(await md5('../var/test.mp4'))
	console.log('Delay: '+(Date.now()-start))
})()
