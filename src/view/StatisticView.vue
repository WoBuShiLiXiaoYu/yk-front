<template>
  <el-row>

    <el-col :span="6">
      <el-statistic :value="summaryData.effectiveActivityCount">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            市场活动
          </div>
        </template>
        <template #suffix>/{{ summaryData.totalActivityCount }}</template>
      </el-statistic>
    </el-col>

    <el-col :span="6">
      <el-statistic title="线索总数" :value="summaryData.totalClueCount" />
    </el-col>

    <el-col :span="6">
      <el-statistic title="客户总数" :value="summaryData.totalCustomerCount" />
    </el-col>

    <el-col :span="6">
      <el-statistic :value="summaryData.successTranAmount">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            交易总额
          </div>
        </template>
        <template #suffix>/{{ summaryData.totalTranAmount }}</template>
      </el-statistic>
    </el-col>
  </el-row>

  <div id="saleFunnelChart" style="width: 50%;height:450px; margin-top: 50px ; float: left"></div>

  <div id="sourcePieChart" style="width: 50%;height:600px; margin-top: 50px; float: left"></div>

</template>

<script>
import {doGet} from "../http/httpRequest";
import * as echarts from 'echarts';

export default {
  name: "StatisticView",
  data() {
    return {
      summaryData: {},
    }
  },

  mounted() {
    this.loadSummaryData();
    this.loadSaleFunnelChart();
    this.loadSourcePieChart();
  },

  methods: {
    loadSummaryData() {
      doGet("/api/statistic/summary/getData").then(resp => {
        if (resp.data.code === 0) {
          this.summaryData = resp.data.data;
        }
      })
    },

    // 漏斗图
    loadSaleFunnelChart() {
      // 查询数据
      doGet("/api/statistic/saleFunnel/getSaleFunnelData").then(resp => {
        if (resp.data.code === 0) {
          let saleFunnelData = resp.data.data;

          var chartDom = document.getElementById('saleFunnelChart');
          var myChart = echarts.init(chartDom);
          var option;

          // 配置可选项
          option = {
            // 标题组件
            title: {
              // 主标题
              text: '销售漏斗图',
              left: 'center',
              top: 'bottom'
            },
            // 提示框组件
            tooltip: {
              trigger: 'item',
              // 提示框浮层内容格式器 漏斗图: {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
              formatter: '{a} <br/>{b} : {c}'
            },
            toolbox: {
              feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
              }
            },
            // 图例组件
            legend: {
              data: ['线索', '客户', '交易人数', '成交人数']
            },
            series: [
              {
                name: '销售数据统计',
                type: 'funnel',
                left: '10%',
                top: 60,
                bottom: 60,
                width: '80%',
                min: 0,
                max: 100,
                minSize: '0%',
                maxSize: '100%',
                sort: 'descending',
                gap: 2,
                label: {
                  show: true,
                  position: 'inside'
                },
                labelLine: {
                  length: 10,
                  lineStyle: {
                    width: 1,
                    type: 'solid'
                  }
                },
                itemStyle: {
                  borderColor: '#fff',
                  borderWidth: 1
                },
                emphasis: {
                  label: {
                    fontSize: 20
                  }
                },
                data: saleFunnelData
              }
            ]
          };

          // 设置
          option && myChart.setOption(option);
        }
      })
    },

    loadSourcePieChart() {
      doGet("/api/statistic/sourcePie/getSourcePieData").then(resp => {
        if (resp.data.code === 0) {
          let sourcePieData = resp.data.data;

          var chartDom = document.getElementById('sourcePieChart');
          var myChart = echarts.init(chartDom);
          var option;

          option = {
            title: {
              // 主标题
              text: '线索来源统计图',
              left: 'center',
              top: 'bottom'
            },
            legend: {
              top: 'top',

            },
            toolbox: {
              top: 80,
              show: true,
              feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
              }
            },
            series: [
              {
                name: '线索来源统计',
                type: 'pie',
                radius: [40, 200],
                center: ['50%', '55%'],
                roseType: 'area',
                itemStyle: {
                  borderRadius: 8
                },
                data: sourcePieData
              }
            ]
          };

          option && myChart.setOption(option);
        }
      })
    }
  }
}
</script>

<style scoped>
.el-row {
  text-align: center;
}
</style>