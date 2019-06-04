<template>
    <div id="myDiagramDiv">
        <div id="echart" :style="{height: diagramheight + 'px'}"></div>
    </div>
</template>

<script>
    import go from '@/assets/js/go.js';
    import FileSaver from 'file-saver';
    import echarts from 'echarts/lib/echarts';
    import pie from 'echarts/lib/chart/pie';
    import graph from 'echarts/lib/chart/graph';
    import tooltip from 'echarts/lib/component/tooltip';
    import title from 'echarts/lib/component/title';
    import 'echarts/lib/component/toolbox';

    const $ = go.GraphObject.make;
    const colorMap = {
        hdfs: ['#9F95EB', '#CDD1ED'],
        hive: ['#F8BF4F', '#BADAEC'],
        mysql: ['#F85F60', '#BEEBEB'],
        oracle: ['#FDDDD0', '#FDE0D0'],
        sparksql: ['#D6F0C9', '#FAD3D5'],
        sqlserver: ['#D3E1F7', '#F9C5D7'],
        transfer: ['#FCD2E8', '#FDEAA6']
    };

    export default {
        props: ['id', 'fullScreen', 'download'],
        watch: {
            'fullScreen': function(val) {
                //全屏切换的时候,重新刷新画面大小
                this.echart.resize({
                    width: 'auto',
                    height: 'auto'
                });
            },
            'download': function() {
                const mycanvas = document.getElementsByTagName('canvas')[0];  //准备空画布
                console.log(mycanvas);
                console.log(mycanvas.height);
                const image = mycanvas.toDataURL("image/jpeg");
                this.downloadIamge(image);
            }
        },
        data() {
            return {
                echart: null,
                diagramWith: 0,
                diagramheight: 600,
                image: null,
                imgLoadComplete: false,
                postNodesSize: 0,   //根节点才统计
                preNodesSize: 0,
                modelData: null,
                diagram: null,
                loading: null,
                sqlText: this.$t('content.common.zwsj')
            };
        },
        methods: {
            dataURItoBlob(dataURI) {
                const byteString = atob(dataURI.split(',')[1]);
                const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                console.log(mimeString);
                return new Blob([ab], {type: mimeString});
            },
            downloadIamge(URL) {
                let blob = this.dataURItoBlob(URL);
                FileSaver.saveAs(blob, `${this.$t('content.dataset.datasetDetail.xygxt')}.png`);
            },
            fetchData() {
                const self = this;
                this.axios.get(`/lineage/dataset/${this.id}/200`).then(res => {
                    let data = res.data.message.data;
                    let nodes = data.nodes;
                    let links = data.links;
                    const width = Math.abs(data.maxX) + Math.abs(data.minX);
                    const height = Math.abs(data.maxY) + Math.abs(data.minY);

                    this.diagramWith = width;
                    this.diagramheight = height;

                    nodes.forEach(node => {
                        node.x = node.xAxis;
                        node.y = node.yAxis;
                        node.lineStyle = {
                            color: "#FB9A4D"
                        };

                        if (node.node_type === 'script') {
                            node.symbol = "circle";
                            node.name = node.job_type;
                            node.symbolSize = [50, 50];

                            node.itemStyle = {
                                color: colorMap[node.job_type][0]
                            };
                        } else {
                            node.symbol = "rect";
                            node.name = node.tbl_name.length > 10 ? node.tbl_name.substr(0, 10) + '...' : node.tbl_name;
                            node.symbolSize = [100, 100];
                            node.symbolKeepAspect = true;

                            if (node.datasetType === 'View') {
                                node.itemStyle = {
                                    color: "#E7F3FD"
                                };
                                node.label = {
                                    color: "#108EE9"
                                };
                            } else if (node.rootNode) {
                                node.itemStyle = {
                                    color: "#FB9A4D",
                                    backgroundColor: '#F00'
                                };
                                node.label = {
                                    color: "#FFF"
                                };
                            } else {
                                node.itemStyle = {
                                    color: "#E1E0EC"
                                };
                                node.label = {
                                    color: "#7561EE",
                                    position: 'insideLeft',
                                    distance: 10,
                                    width: 40
                                };
                            }
                        }
                    });
                    console.log(this.$el.getElementsByTagName('div')[0]);
                    let pieChart = this.$el ? echarts.init(this.$el.getElementsByTagName('div')[0]) : false;
                    this.echart = pieChart;

                    function nodeInfo(d) {  // Tooltip info for a node data object
                        let tips = self.$t('content.dataset.datasetDetail.a3') + d.storage_type + "<br />";
                        if (d.rootNode) {
                            tips += self.$t('content.dataset.datasetDetail.a1') + self.preNodesSize + "<br />";
                            tips += self.$t('content.dataset.datasetDetail.a2') + self.postNodesSize + "<br />";
                        }
                        if (d.storage_type === 'hdfs') {
                            tips += self.$t('content.dataset.datasetDetail.a4') + d.urn;
                        } else {
                            tips += self.$t('content.dataset.datasetDetail.bm') + ':' + d.tbl_name + "<br />";
                            tips += self.$t('content.dataset.datasetDetail.km') + ':' + d.db_name;
                        }
                        return tips;
                    }

                    function nodeInfo1(d) {  // Tooltip info for a node data object
                        let str = self.$t('content.dataset.datasetDetail.a5') + d.etl_name + "<br />";
                        str += self.$t('content.dataset.datasetDetail.a6') + d.job_name + "<br />";
                        str += self.$t('content.dataset.datasetDetail.a7') + d.job_type + "<br />";
                        str += self.$t('content.dataset.datasetDetail.a8') + d.owner_id + "<br />";
                        str += self.$t('content.dataset.datasetDetail.a9') + d.ref_id + "<br />";
                        str += self.$t('content.dataset.datasetDetail.a10') + d.job_start_time + "<br />";
                        str += self.$t('content.dataset.datasetDetail.a11') + d.job_end_time + "<br />";
                        str += self.$t('content.dataset.datasetDetail.a12') + d.app_name;
                        return str;
                    }

                    pieChart.setOption({
                        tooltip: {
                            formatter: function(params, ticket, callback) {
                                if (params.data.node_type === 'script') {
                                    return nodeInfo1(params.data);
                                } else {
                                    return nodeInfo(params.data);
                                }
                            }
                        },
                        legendHoverLink: false,
                        focusNodeAdjacency: false,
                        hoverAnimation: false,
                        animation: false,
                        series: [
                            {
                                type: 'graph',
                                layout: 'none',
                                roam: true,
                                label: {
                                    normal: {
                                        show: true
                                    }
                                },
                                edgeSymbol: ['circle', 'arrow'],
                                edgeSymbolSize: [0, 10],
                                edgeLabel: {
                                    normal: {
                                        textStyle: {
                                            fontSize: 20
                                        }
                                    }
                                },
                                data: nodes,
                                links: links,
                                lineStyle: {
                                    normal: {
                                        opacity: 0.9,
                                        width: 2,
                                        curveness: 0
                                    }
                                }
                            }
                        ]
                    });
                    pieChart.on('click', {dataType: 'node'}, function(event) {
                        self.$emit('select', event.data.sqlText);
                    });
                });
            }
        },
        mounted() {
            this.fetchData();
        }
    };
</script>
<style lang="less">
    #myDiagramDiv {
        width: 100%;
        height: 100%;
    }
</style>
