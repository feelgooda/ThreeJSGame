<template>
  <div class="charts-box">
    <div id="charts1" class="charts"></div>
    <div id="charts2" class="charts"></div>
    <div id="charts3" class="charts"></div>
  </div>
</template>

<script lang="ts">
import { inject, ref, onMounted} from 'vue'
import * as echarts from 'echarts';

export default {
  setup() {
    
    const initData = (id, data) => {
      var chartDom = document.getElementById(id);
      var chart = echarts.init(chartDom);
      data && chart.setOption(data);
    }

    onMounted(() => {

      const option1 = {
        xAxis: {
          type: 'category',
          boundaryGap: false,
        },
        yAxis: {
          type: 'value'
        },
        // tooltip: {
        //   // trigger: 'none',
        //   // triggerOn: 'none',
        //   // formatter: (params) => {
        //   //   console.log(params, '-----------------')
        //   //   return `日期: ${params.data[0]} <br>销量：${params.data[0]}🗡`
        //   // }
        //   triggerOn: 'none',
        //   formatter: function(params) {
        //     return (
        //      'xxxxxxxxxxxxxxxxxxx'
        //     );
        //   }
        // },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            return (
              '<div style="background: red">我是标题</div>' +
              '日期: ' +
              params[0].data[0] +
              '<br />日销量: ' +
              params[0].data[1] + '🗡'
            );
          }
        },
        legend:{
          left:'20',
          top: '20',
        },
        series: [
          {
            name: '日销量',
            data: [[ 'Mon', 150], [ 'Tue', 230], [ 'Wed', 224], [ 'Thu', 218], [ 'Fri', 135], [ 'Sat', 147], [ 'Sun', 260]],
            type: 'line',
            smooth: true
          }
        ]
      };

      const option2 = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      };

      const option3 = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ]
          }
        ]
      };

      initData('charts1', option1)
      initData('charts2', option2)
      initData('charts3', option3)
      
    })
    return {

    }
  }
}
</script>

<style lang="less"  scoped>

.charts-box{
  display: flex;
  flex-wrap: wrap;

  .charts{
    width: 500px;
    height: 500px;
    margin-right: 20px;
  }
}
</style>
