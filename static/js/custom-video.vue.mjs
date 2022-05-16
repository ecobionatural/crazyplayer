

export default {
	props:['type','src'],
	data(){return{
		v:null,
		is_playing:false,
		seekbar_left:0,
		duration:0,
		pos:0,
		skip_steps: [1,2,5,10,20],
		skip_step: 5,
		tl_width: 1800,
		tl_left: 0,
		tl_cursor_pos: 100,
		tl_scale: 5
	}},
	mounted(){
		$(window).resize(()=>this.resize());
		this.resize();
		this.v = this.$refs.video;

		$(window).keydown(e => {
			cl(e.code)
			switch(e.code){
				case 'ArrowLeft': this.skip(-1); break;
				case 'ArrowRight': this.skip(1); break;
				case 'Space': this.playpause(); break;
			}
		})
	},
	computed: {
		play_caption(){
			return this.is_playing ? 'Pause' : 'Play'
		},
		ready_bar_width(){
			return 700;
		},
		seen_bar_width(){
			let px = this.sec2px(this.pos);
			//cl({px})
			return px;
		},
		tl_times(){
			let tt = [];
			for(let t=10; t < this.duration; t+=10)
			{
				tt.push(`${Math.floor(t/60)}:${(t%60+'').padStart(2,'0')}`);
			}
			return tt;
		}
	},
	watch:{
		src(){
			this.is_playing = false;
		}
	},
	methods: {
		resize(){
			cl({seekbar_width:this.seekbar_width()});
			this.seekbar_left = $(this.$refs.seekbar).offset().left;
		},
		seekbar_width(){
			return $(this.$refs.seekbar).width();
		},
		tl_visible_width(){
			return $(this.$refs.tlwrapper).width();
		},
		playpause(){
			if(this.is_playing)
				this.v.pause();
			else this.v.play();
			this.is_playing = !this.is_playing;
		},
		sec2px(sec){
			return Math.round(sec*(this.seekbar_width()/this.duration))
		},
		px2sec(px){
			return Math.round(px*(this.duration/this.seekbar_width()))
		},
		getTime(){
			return this.v.currentTime;
		},
		setTime(sec){
			this.v.currentTime = sec;
			//
		},

		setCursorTime(sec){
			let cpos = sec*this.tl_scale;
			this.tl_cursor_pos = cpos;
			let half = this.tl_visible_width()/2;
			let lfield = cpos-half;
			let rfield = cpos+half;
			if(lfield < 0)
				this.tl_left = 0;
			else{
				if(rfield < this.tl_width)
					this.tl_left = -lfield;
				else
					this.tl_left = -(this.tl_width-this.tl_visible_width())
			}
		},

		meta_ready(e){
			//cl('META RDY')
			this.duration = this.v.duration;
			this.tl_width = this.duration*this.tl_scale;
			//cl({duration:this.duration});
		},

		progress(e){
			let v = this.v;
			//cl('progress')
			//cl(v.seekable)
		},

		timeupdate(){
			this.pos = this.v.currentTime;
			this.setCursorTime(this.pos);
			//cl({pos:this.pos})
		},

		seekbar_click(e){
			let sec = this.px2sec(e.clientX-this.seekbar_left);
			//cl({seekto:sec})
			this.setTime(sec)
		},

		skip(dir)
		{
			cl('skip');
			this.setTime(this.getTime()+(dir*this.skip_step));
		}
	},
	template: `
	<div class="custom-video"
		@keydown.right-arrow="skip(1)"
		@keydown.left-arrow="skip(-1)"
		@keydown="cl('keydown')"
	>
		<div class="video">
			<video
				ref=video
				:type="type"
				:src="src"
				@loadedmetadata="meta_ready"
				@progress="progress"
				@timeupdate="timeupdate"
				@click="playpause"
			/>
		</div>
		<div class=panel>
			<div class=buttons>
				<button @click="playpause" v-html="play_caption"></button>
				Step: <select v-model="skip_step">
					<option
						v-for="step of skip_steps"
						:value="step"
						v-html="'± '+step+'s'"
					/>
				</select>
			</div>
			<div class=seekbar ref=seekbar @click="seekbar_click">
				<div class="bar ready" :style="{width:ready_bar_width+'px'}"></div>
				<div class="bar seen" :style="{width:seen_bar_width+'px'}"></div>
			</div>
			<div class=editor>
				<div class=timeline_wrapper ref="tlwrapper">
					<div class=timeline :style="{width:tl_width+'px',marginLeft:tl_left+'px'}">
						<div class="times">
							<span v-for="time of tl_times"
								v-html="time"
							/>
						</div>
						<div class=cursor :style="{left:tl_cursor_pos+'px'}"/>
					</div>

				</div>
			</div>
		</div>
	</div>
	`
}
