<template>
  <div class="message-container">
		<el-dialog :title="title" :visible.sync="messageVisible" width="385px">
      <div class="content-container">
        {{message}}
      </div>
		  <span slot="footer" class="dialog-footer">
        <el-button @click="messageVisible=false">取 消</el-button>
		    <el-button type="primary" @click="postData">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
  import Bus from 'utils/bus'
  export default{
    name: 'messageConfirm',
    props: ['title', 'message', 'callback'],
    data(){
      return {
        messageVisible: true,
      }
    },
    methods: {
      postData(){
        const callbackName = this.callback;
        if(callbackName){
          Bus.$emit(callbackName);
        }
        this.messageVisible = false;
      }
    }
  }
</script>
<style>
  .content-container{
    text-align: center;
    padding: 10px 0;
  }
</style>
