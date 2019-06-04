<template>
<div id="MainCon">
	<div class="datasetList">
		<div class="title">
			<div class="titShow">
				<h4>
					<span>{{$t("content.import.drpz")}}</span>
					<span class="path">{{importPath}}</span>
				</h4>
			</div>
		</div>
		<div class="tabs" id="TblTab">
			<ul>
				<router-link to="/DataImport/DataImportRecord" tag="li" active-class="active" @click.native="setTitle('系统导入')">
					{{$t("content.import.xtdr")}}
				</router-link>
				<router-link to="/DataImport/DataImportManual" tag="li" active-class="active" @click.native="setTitle('手动文件导入')">
					{{$t("content.import.sdwjdr")}}
				</router-link>
			<!-- 	<router-link to="/DataImport/DataImportTemplate" tag="li" active-class="active" @click.native="setTitle('模板导入')">
					模板导入
				</router-link> -->
			</ul>
	</div>
	<div class="content-container">
		<router-view></router-view>
	</div>
</div>


</div>
</template>

<script>
export default {
	data() {
		return {
			seletTitle: this.$t('content.import.drpz'),
			isActive: true
		}
	},
	created() {
		this.$router.push({ name: 'DataImportRecord', append: true});
	},
	methods: {
		setTitle(titleName){
			this.seletTitle = titleName;
		}
	},
	computed: {
		importPath(){
			return ` > ${this.seletTitle}`;
		}
	},
}
</script>
<style>
	.con .tableTitle tbody td:last-child{width: 15%}
</style>
