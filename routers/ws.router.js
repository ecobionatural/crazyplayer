import open from 'open';
import {dirname} from 'path';
import fs from 'fs';
import audio_peaks from '../lib/audio_peaks.js';

export default {
	// ping(){
	// 	return {}
	// },
	// open_file(d){
	// 	cl('Opening file '+d)
	// 	if(d)
	// 	{
	// 		//opening page in default browser
	// 		open('http://localhost:'+c.port+'/#'+d);
	// 	}
	// },
	// async get_peaks(d){
	// 	cl('getting peaks')
	// 	let peaks = await audio_peaks.getFromVideoCached(decodeURIComponent(d.video_path));
	// 	cl('peaks ready')
	// 	cl({peaks})
	// 	return {peaks};
	// },
	// get_folder_files(d){
	// 	//let dir = dirname(d.file);
	// 	let dir = d.dir;
	// 	if(/^[a-z]\:$/i.test(dir))dir += '/';
	// 	cl({dir})
	// 	let ff = fs.readdirSync(dir);
	// 	let rex = new RegExp(`\\.(${c.valid_exts.join('|')})$`);
	//
	// 	return {files:ff
	// 		.map(f=>{
	// 			let out = {name:f}
	// 			try{
	// 				let stat = fs.lstatSync(d.dir+'/'+f);
	// 				out.isdir = stat.isDirectory();
	// 			}catch(e)
	// 			{
	// 				out.error = e+'';
	// 			}
	// 			return out;
	// 		})
	// 		.filter(d=>d.isdir || rex.test(d.name))
	// 	};
	// }
}
