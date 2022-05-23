import fs from 'fs';
import path from 'path';
import {exec} from 'child_process';

const cl = console.log;

function getFromRaw(file,samples_for_peak){
	let data = fs.readFileSync(file);
	cl(data.length);

	let peaks_length = Math.floor(data.length/samples_for_peak);
	let peaks = new Array(peaks_length);
	let max = 0;
	for(let i=0;i < peaks_length;i++)
	{
		let offs = i*samples_for_peak;
		let slice = data.slice(offs,offs+samples_for_peak);
		//cl({slice});
		peaks[i] = getPeak(slice);
		if(peaks[i] > max)max = peaks[i];
		//break;
	}
	//cl({peaks})
	return peaks;
	// 	{
	// 	peaks,
	// 	max
	// }
}

async function getFromVideo(file){
	let rawfile = c.root+'/var/raws/'+Date.now()+'.raw';
	let res = await new Promise((s,j)=>{

		let cmd = `ffmpeg -i "${file}" -vn -f u8 -ac 1 -ar 4000 ${rawfile}`;
		exec(cmd,(err,stdout,stderr)=>{
			let res = stdout || stderr;
			s(res);
		});
	});
	if(!fs.existsSync(rawfile))
		throw "Rawfile not created";

	let peaks = getFromRaw(rawfile,400);
	fs.unlinkSync(rawfile);
	return peaks;
}

async function getFromVideoCached(file){
	let abs = path.resolve(file).replace(/\\/g,'/');
	let cachename = abs.replace(/^[^\/]+\//,'').replace(/\//g,'__');
	cl({abs,cachename})
	let cachepath = c.root+'/var/cache/peaks/'+cachename+'.json';
	if(fs.existsSync(cachepath)){
		cl('Cached')
		return JSON.parse(fs.readFileSync(cachepath));
	}
	else{
		let q = await getFromVideo(file);
		fs.writeFileSync(cachepath,JSON.stringify(q));
		return q
	}
}

function getPeak(slice)
{
	let sum = 0;
	for(let byte of slice)
	{
		if(byte < 0x80)continue;
		sum += byte-0x80;
	}
	let peak = Math.round(sum/(slice.length/4));
	return peak > 255 ? 255 : peak;
}


export default {
	getFromRaw,
	getFromVideo,
	getFromVideoCached
}
