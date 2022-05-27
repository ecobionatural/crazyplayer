import FileList from './filelist.vue.mjs';

export default {
	components: {FileList},
	props: ['playing_path'],
	data(){return{
		cur_dir: ''
	}},
	created(){
		this.initPath()
	},
	computed:{
		cur_dir_parts(){
			let parts = this.cur_dir.split('/');
			let path = parts[0]+'/';
			let list = [{first:1,txt:path+'',path:path+''}];

			for(let i=1;i < parts.length;i++)
			{
				if(!parts[i].trim())
					break;
				path += parts[i]+'/';
				list.push({txt:parts[i],path:path+''})
			}
			return list;
		}
	},
	watch:{
		playing_path(){
			this.initPath();
		}
	},
	methods:{
		initPath()
		{
			this.cur_dir = splitDir(this.playing_path)[0];
		},
		changeDir(path){
			cl({chdir:path})
			this.cur_dir = path;
		}
	},
	template: `<div class=sidepanel>
		<div class="cur_dir">
			<span v-for="part of cur_dir_parts">
				<a v-html="part.txt" @click="changeDir(part.path)" />
				<span v-if="!part.first">/</span>
			</span>
		</div>
		<FileList
			:playing_path="playing_path"
			:cur_dir="cur_dir"
			@playfile="$emit('playfile',$event)"
			@change_dir="changeDir"
		/>
	</div>`
}
