<template>
    <div class="grid-content">
      <header class="source-list-header rankList-wrapper">
        <h3>
          <span v-if="tableName!=$t('content.header.qb')">{{tableName}}</span>
          {{listTitle}}
        </h3>
        <a class="rankList-btn" href="javascript:;" @click="pushRouter" v-if="linkText">{{linkText}}></a>
      </header>
      <div class="source-list-container">
        <h4>{{labelTitle}}</h4>
        <span>{{toThousand(total)}}</span>
      </div>
    </div>
</template>
<script>
  import {ToThousand} from 'mixins/common'
  export default{
    name: 'SourceList',
    props: {
      listTitle: {
        require: true
      },
      labelTitle: {
        require: true
      },
      total: [Number],
      linkText: [String],
      routerName: [String],
      tableName: [String]
    },
    mixins: [ToThousand],
    methods: {
      pushRouter(){
        this.$router.push({name: this.routerName})
      }
    }
  }
</script>
<style scope>
	.source-list-header a{
		display: inline-block;
		line-height: 30px;
		color: #5a6779;
	}

  .source-list-header{
    display: flex;
    justify-content: space-between;
  }
</style>
