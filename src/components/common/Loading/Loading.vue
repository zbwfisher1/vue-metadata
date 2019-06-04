<!-- <template>
	<div class="loading-container" style="border: 1px solid blue;">
		<img style="border: 1px solid blue;" src={this.imgSrc} />
  </div>
</template> -->
<script>
	export default{
		name:"Loading",
		data(){
			return {
				imgSrc: this.isTree ? require('assets/images/loading_left.gif') : require('assets/images/loading_right.gif')
			}
		},
		props:{
			isloading:{
				type:Boolean,
				default:false
			},
			isTree: {
				default: false
			}
		},
		render(h){
			if(this.isloading){
				return <div class="loading-container">
									<img src={this.imgSrc} />
							 </div>
			}else{
				return
			}
		}
	}
</script>
<style media="screen" scope>
	.loading-container{
        position: relative;
        height: 80px;
		text-align: center;
	}
	.loading-container img{
		position: absolute;
		transform: translateY(50%);
		top: -50%;
	}
</style>
