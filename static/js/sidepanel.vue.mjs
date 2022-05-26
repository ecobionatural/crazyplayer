import FileList from './filelist.vue.mjs';

export default {
	components: {FileList},
	props: ['playing_path','cur_dir'],
	methods:{
	},
	template: `<div class=sidepanel>
		<div class="cur_dir" v-html="cur_dir"></div>
		<FileList
			:playing_path="playing_path"
			:cur_dir="cur_dir"
			@playfile="$emit('playfile',$event)"
			@change_dir="$emit('change_dir',$event)"
		/>
	</div>`
}
