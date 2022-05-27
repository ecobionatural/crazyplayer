
export default {
	props: ['cur_dir','playing_path'],
	data(){return{
		playing_dir:'',
		playing_file:'',
		cur_dir_files:[]
	}},
	async created(){
		this.cur_dir_files = await this.getFileList(this.cur_dir);
		this.initPath();
		window.onkeydown = e => {
			if(e.key=='PageDown' || e.key=='PageUp')
			{
				e.preventDefault();
				this.playNext(e.key=='PageDown' ? 1 : -1);
			}
		}
	},
	watch:{
		async cur_dir(){
			this.cur_dir_files = await this.getFileList(this.cur_dir);
		},
		playing_path(){
			this.initPath();
		}
	},
	computed:{
		filelist(){
			return this.prepareFileList(this.cur_dir_files)
		}
	},
	methods:{
		initPath()
		{
			let m = splitDir(this.playing_path);
			this.playing_dir = m[0];
			this.playing_file = m[1];
		},
		async getFileList(dir){
			let res = await ajax('/api/get_folder_files',{dir});
			return res.files;
		},
		prepareFileList(list)
		{
			let files = list.map(f => {
				let ext = f.name.replace(/^.+?\.([^\.]+)$/,'$1');
				return{
					...f,
					type: f.isdir ? 'folder' : (this.getMediaType(ext) || 'noext'),
					unplayable: !f.isdir && !this.isPlayable(f.name),
					sortpref: f.isdir ? 'a' : 'b'
				}
			});
			files.sort((a,b) => a.sortpref+a.name > b.sortpref+b.name ? 1 : -1)
			cl({files})
			return [
				{name:'..',type:'noext'},
				...files
			];
		},
		async playNext(direction)
		{
			cl({direction})
			let filelist = this.filelist;
			if(this.playing_dir!=this.cur_dir)
			{
				// this.$emit('change_dir',this.playing_dir);
				// setTimeout(()=>{this.playNext(direction)},10);
				// return;
				filelist = this.prepareFileList(await this.getFileList(this.playing_dir))
			}
			else
				filelist = this.filelist;

			cl({dir:this.playing_dir,filelist})

			let ind = filelist.findIndex(v => v.name==this.playing_file);
			let path = this.findNextPlayable(filelist,ind,direction);
			cl({path})
			if(!path)return alert('No more videos to play');
			this.$emit('playfile',path);

		},
		isPlayable(fname){
			return /\.(mp[234]|mpe?g[234]?|mkv|webm|ogg)$/i.test(fname)
		},
		getMediaType(ext){
			if(/^(mpe?g[24]?|mp[24]|mkv|webm|ogg|wmv|avi|flv)$/.test(ext))
				return 'video';
			if(/^(jpe?g|webp|png|svg|bmp|gif|tiff?)$/.test(ext))
				return 'image';
			if(/^(mp3)$/.test(ext))
				return 'audio';
		},
		findNextPlayable(filelist,start_index,direction){
			cl({start_index,direction})
			let last_index = filelist.length-1;
			if(start_index > last_index)
				start_index = last_index;
			else if(start_index < 0)
				start_index = 0;

			let stop_index = direction > 1 ? last_index : 0;
			for(let ind = start_index+direction;
				ind >= 0 && ind <= last_index;
				ind+=direction)
			{
				let fname = filelist[ind].name;
				if(this.isPlayable(fname)){
					return this.playing_dir+'/'+fname;
				}
			}
			return null;
		},
		clickOnFile(file){
			if(file.name=='..')
			{
				let dir = splitDir(this.cur_dir);
				this.$emit('change_dir',dir[0]);
			}
			else if(file.isdir)
			{
				let dir = this.cur_dir+file.name+'/';
				this.$emit('change_dir',dir);
			}
			else
				this.$emit('playfile',this.cur_dir+file.name)
		}
	},
	template: `
	<div class="filelist">
		<div class=list>
			<div
				class="item"
				v-for="file of filelist"
				:key="file.name"
				v-html="file.name"
				:class="{
					current:(file.name==playing_file && playing_dir==cur_dir),
					[file.type]:1,
					unplayable: file.unplayable
				}"
				:title="file.name"
				@click="clickOnFile(file)"
			/>
		</div>
	</div>`
}
