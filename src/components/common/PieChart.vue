<template>
	<div style="width: 100%; min-height: 400px;"></div>
</template>

<script>
	import echarts from 'echarts/lib/echarts'
	import pie from 'echarts/lib/chart/pie'
	import tooltip from 'echarts/lib/component/tooltip'
	import title from 'echarts/lib/component/title'



	import { FormatSize } from 'mixins/common'
	import { ChartColor } from 'utils'
	export default{
		name:"PieChart",
		props: {
			pieOptions: [Object],
			title: [Number]
		},
		mixins: [ FormatSize ],
		data(){
			const vm = this;
			return {
				option: {
					legend: {
						show: true
					},
					color: ChartColor,
				  tooltip: {
				      trigger: 'item',
							backgroundColor: '#ab9fff',
							borderRadius: 0,
				      formatter: "{a} {b}: {d}%"
				  },
			   series: [
		       {
	           type:'pie',
		       }
			   ]
				 },
			}
		},
		mounted(){
			this.showPie()
		},
		watch: {
			pieOptions(val){
				this.showPie()
			},
			'$parent.$parent.$parent.showLabel'(){
				this.showPie()
			}
		},
		computed: {
			reOptions(){
				let newOptions = null;
				if(this.pieOptions){
					newOptions = Object.assign({}, this.option, this.pieOptions)
				}else{
					newOptions = this.option;
				}
				return newOptions;
			}
		},
		methods: {
			showPie(){
				let pieChart = this.$el ? echarts.init(this.$el) : false;
				this.option.color = ChartColor
				pieChart.setOption(this.reOptions)
			}
		}
	}
</script>
