<template>
    <div class="chartContainer" style="width: 100%;">
        <highcharts :options="options" ref="highcharts"></highcharts>
    </div>
</template>
<script>
    export default{
        name:'LineChart',
        props:{
            colors:{
                type:Array,
                default(){
                    return ['#fb7a53', '#ffbf01', '#ffdc16', '#92d14f', '#31c45e', '#50da9e', '#76e9e2', '#26d4ff', '#2cabf4', '#1064fe', '#f0f0f0']
                }
            },
            series:{
                type:Array,
                default(){
                    return  [{
                        name: '东京',
                        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                     }]
                }
            },
            categories:{
                type:Array,
                default(){
                  return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                }
            }
        },
       computed:{
        options(){
        const {colors,series,categories} = this;
            return  {
                chart: {
                    type: 'line',
                    spacing:[40,10,10,10]
                },
                title: {
                    text:null,
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                colors:colors,
                xAxis: {
                    gridLineColor:"#e0e0e0",
                    gridLineWidth:1,
                    lineColor:"#e0e0e0",
                    tickLength:0,
                    categories
                },
                yAxis: {
                    title: {
                        text: '温度 (°C)'
                    },
                    gridLineColor:"#e0e0e0",
                },
                tooltip: {
                    backgroundColor:'#ab9fff',
                    borderColor:'#ab9fff',
                    borderRadius: 0,
                    style: {
                        color: '#fff',
                    },
                    valueSuffix: '°C'
                },
                series
             }
         }
       },
    }
</script>
<style lang="less">
</style>
