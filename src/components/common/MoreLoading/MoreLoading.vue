<script>
  export default{
    name: 'MoreLoading',
    data(){
      return {
        imgSrc: this.isTree ? require('assets/images/loading_left.gif') : require('assets/images/loading_right.gif')
      }
    },
    props: {
      isloading: Boolean,
      isFull: {
        type: Boolean,
        default: false
      },
      isTree: {
				default: false
			}
    },
    render(h){
      if(this.isloading){
        if(this.isFull) return <div class="more-loading-container"></div>
        else return <div class="more-loading-container">
    									<img src={this.imgSrc} />
    							  </div>
      }else{
        return;
      }
    }
  }
</script>
<style media="screen" scope>
  .more-loading-container{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    opacity: 0.5;
    z-index: 1000;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
