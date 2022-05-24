import express from 'express';
const router = express.Router();
import fs from 'fs';
import open from 'open';
import {dirname} from 'path';
import audio_peaks from '../lib/audio_peaks.js';

router.get('/',(req,res)=>{
	res.render(c.root+'/views/main.pug');
});
// router.get('/qq/',(req,res)=>{
// 	//res.render(c.root+'/views/main.pug');
// 	res.send(`
// 		<script>
// 			window.open("/q/","qq","width=500 height=300 scrollbars=0 titlebar=0 toolbar=0 status=0 menubar=0 location=0");
// 			window.close();
// 		</script>`)
// });
// router.get('/q/',(req,res)=>{
// 	res.send('Q!')
//})
router.get('/video',(req,res)=>{
	res.sendFile(req.query.url);
})

router.post('/api/:cmd',async (req,res)=>{

		await lib.api(req,res,{
			ping(){
				return {}
			},
			open_file(b){
				cl('Opening file '+b.file)
				if(d)
				{
					//opening page in default browser
					open('http://localhost:'+c.port+'/#'+b.file);
				}
			},
			async get_peaks(b){
				cl('getting peaks')
				let peaks = await audio_peaks.getFromVideoCached(decodeURIComponent(b.video_path));
				cl('peaks ready')
				cl({peaks})
				return {peaks};
			},
			get_folder_files(b){
				//let dir = dirname(d.file);
				let dir = b.dir;
				if(/^[a-z]\:$/i.test(dir))dir += '/';
				cl({dir})
				let ff = fs.readdirSync(dir);
				let rex = new RegExp(`\\.(${c.valid_exts.join('|')})$`);

				return {files:ff
					.map(f=>{
						let out = {name:f}
						try{
							let stat = fs.lstatSync(d.dir+'/'+f);
							out.isdir = stat.isDirectory();
						}catch(e)
						{
							out.error = e+'';
						}
						return out;
					})
					.filter(d=>d.isdir || rex.test(d.name))
				};
			}
		});
})


export default router;
