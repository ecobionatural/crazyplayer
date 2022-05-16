import fs from 'fs';
import {execSync} from 'child_process';

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
	return {
		peaks,
		max
	}
}

function getFromVideo(file){
	let rawfile = c.root+'/var/raws/'+Date.now()+'.raw';
	let cmd = `ffmpeg -i "${file}" -vn -f u8 -ac 1 -ar 4000 ${rawfile}`;
	execSync(cmd);
	if(!fs.existsSync(rawfile))
		throw "Rawfile not created";

	return getFromRaw(rawfile,400);
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
	return peak > 127 ? 127 : peak;
}


export default {
	getFromRaw,
	getFromVideo
}
