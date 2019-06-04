<template>
  <div class="import-header-item">
    <div class="import-header-content">
      <div class="item-left">
        <i :class='`import_item_icon${id}`'></i>
      </div>
      <article class="item-right">
        <h4>{{title}}</h4>
        <p>{{content}}</p>
      </article>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'importHeaderItem',
    props: {
      justify: {
        type: String,
        default: 'flex-start'
      },
      title: {
        require: true,
        type: String
      },
      content: {
        require: true,
        type: String
      },
      id: String
    },
    data(){
      return {

      }
    }
  }
</script>
