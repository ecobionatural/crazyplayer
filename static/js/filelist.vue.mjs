
export default {
	props: ['cur_dir','cur_file'],
	data(){return{
		dir:'',
		files:''
	}},
	created(){
		this.dir = this.cur_dir;
		window.onkeydown = e => {
			if(e.key=='PageDown' || e.key=='PageUp')
			{
				e.preventDefault();
				this.playNext(e.key=='PageDown' ? 1 : -1);
			}
		}
	},
	watch:{
		async dir(){
			let res = await wssend('get_folder_files',{dir:this.dir});
			this.files = res.files;
		}
	},
	computed:{
		filelist(){
			return [{name:'..'},...this.files];
		}
	},
	methods:{
		playNext(direction)
		{
			cl({direction})
			if(this.dir!=this.cur_dir)
			{
				this.dir = this.cur_dir;
				setTimeout(()=>{this.playNext(direction)},0);
				return;
			}

			let ind = this.files.findIndex(v => v.name==this.cur_file);
			let path = this.findNextPlayable(ind,direction);
			cl({path})
			if(!path)return alert('No more videos to play');
			this.$emit('playfile',path);

		},
		findNextPlayable(start_index,direction){
			cl({start_index,direction})
			let last_index = this.files.length-1;
			if(start_index > last_index)
				start_index = last_index;
			else if(start_index < 0)
				start_index = 0;

			let stop_index = direction > 1 ? last_index : 0;
			for(let ind = start_index+direction;
				ind >= 0 && ind <= last_index;
				ind+=direction)
			{
				let fname = this.files[ind].name;
				if(/\.(mp4|mpeg4|mkv|webm|ogg)$/i.test(fname)){
					return this.dir+'/'+fname;
				}
			}
			return null;
		},
		clickOnFile(file){
			if(file.name=='..')
			{
				this.dir = this.dir.replace(/\/[^\/]+$/,'');
			}
			else if(file.isdir)
			{
				this.dir += '/'+file.name
			}
			else
				this.$emit('playfile',this.dir+'/'+file.name)
		}
	},
	template: `
	<div class="filelist">
		<div
			class=item
			v-for="file of filelist"
			:key="file.name"
			v-html="file.name"
			:class="{current:file.name==cur_file && dir==cur_dir}"
			@click="clickOnFile(file)"
		/>
	</div>`
}
