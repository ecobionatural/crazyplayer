import open from 'open';
import {dirname} from 'path';
import fs from 'fs';

export default {
	ping(){
		return {}
	},
	open_file(d){
		cl('Opening file '+d)
		if(d)
		{
			open('http://localhost:'+c.port+'/#'+d);
		}
	},
	get_folder_files(d){
		//let dir = dirname(d.file);
		let ff = fs.readdirSync(d.dir);
		let rex = new RegExp(`\\.(${c.valid_exts.join('|')})$`);

		return {files:ff
			.map(f=>{return{
				name:f,
				isdir:fs.lstatSync(d.dir+'/'+f).isDirectory()
			}})
			.filter(d=>d.isdir || rex.test(d.name))
		};
	}
}
