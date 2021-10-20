<template>
  <div class="test-box">
    <div class="list" v-for="(items, idx) in realFliterList" :key="idx">
      <div class="items-box">
        <div class="title">{{items.name}}：</div>
        <div :class="['items', {active: checkData[fliterkeyList[idx]] === val.value, disabel: val.disabel }]" 
          v-for="val in items.configs"
          :key="val.value"
          @click="handleClick(val.value, fliterkeyList[idx], val.disabel)"
        >
          {{val.label}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive,  ref, computed, toRefs } from 'vue'

export default defineComponent({
  props: {
    filterData: {
      type: Object,
      default: () => ({
        color: '',
        size: '',
        big: '',
        brand: '',
        test: ''
      })
    },
    fliterList: {
      type: Array,
      default: () => [
        {
        id: 1,
        name: '颜色:',
         configs: [
            { label: '蓝色', value: 'blue', disabel: true },
            { label: '绿色', value: 'green', disabel: true },
            { label: '黄色', value: 'orange', disabel: true },
          ]
        },
        {
          id: 2,
          name: '尺寸:',
          configs: [
            { label: '大', value: 'max', disabel: true },
            { label: '中', value: 'mindle', disabel: true },
            { label: '小', value: 'min', disabel: true },
          ]
        },
        {
          id: 3,
          name: '内存:',
          configs: [
            { label: '16G', value: '2', disabel: true },
            { label: '8G', value: '1', disabel: true },
            { label: '4G', value: '0', disabel: true },
          ]
        },
        {
          id: 4,
          name: '牌子:',
          configs: [
            { label: '微星', value: 'wx', disabel: true },
            { label: '华硕', value: 'hs', disabel: true },
            { label: '三星', value: 'sx', disabel: true },
            { label: '七彩虹', value: 'qch', disabel: true },
          ]
        },
      ]
    },
    realList: {
      default: () => [ // 可选配置
        ['blue', 'mindle', '2'],
        ['blue', 'min', '0'],
        ['green', 'max', '2'],
        ['orange', 'mindle', '1', 'qch'],
        ['orange', 'max', '1', 'qch'],
        ['orange', 'max', '1', 'qch'],
        ['orange', 'max', '1', 'sx'],
        ['orange', 'max', '1', 'wx'],
        ['orange'],
        ['mindle', '1'],
      ],
      type: Array
    }
  },
  setup (props) {
    const realList = props.realList
    const checkData = reactive(props.filterData)
    const fliterkeyList = Object.keys(checkData)
    const realFliterList = computed(() => {
      const copyFliterList = JSON.parse(JSON.stringify(props.fliterList)) as any[]
      copyFliterList.forEach((val, idx) => {
        val.configs.forEach(item => {
          item.disabel = true
        })
        handleFilter(val.configs, fliterkeyList[idx])
      })

      return copyFliterList
    })

    const handleFilter = (copeList, key) => {
      // console.log(1)
      // const copeList = JSON.parse(JSON.stringify(handleList))
      copeList.forEach(value => {
        const arr = realList.filter(val => {
          for (let i = 0; i < val.length; i++) {
            if (val[i] === value.value) {
              return true
            }
          }
          return false
        })
        // 开始筛选
        if (key === 'color') { console.log(arr) }
        arr.forEach(val => {
            const keyList = Object.keys(checkData).filter(ite => ite !== key && checkData[ite] !== '') // 过滤掉自己对应的key 与 空key
            const valList = val.filter(ite => ite !== value.value) // 过滤掉自己 ps:其中一条配置项
            if (keyList.length === 0 && valList.length === 0) { value.disabel = false }  // 满足条件
            else if (valList.length > 0) {
              filter(keyList, value, valList)
            }
        })

      })

      // return copeList
    }

    // 递归判断每一个已选的checkData
    const filter = (keyList:any[], value, valList:any[]) => {
      if  (keyList.length === 0) { value.disabel = false }
      else {
        keyList.forEach(ite => {
          const has = valList.findIndex(val => val === checkData[ite])
          // if (value.label === '16G') { console.log(checkData[ite],keyList, valList, has, '=') }
          const nextKeyList = keyList.filter(item => ite !== item) // 已匹配的过滤掉 ---已选配置
          const nextValList= valList.filter(item => checkData[ite] !== item) // 已匹配的过滤掉   ---配置项
          // if (value.label === '16G') { console.log(nextKeyList,nextValList, '-') }
          if (nextKeyList.length === 0  && has !== -1) {
            value.disabel = false // 满足条件
          } else if (nextKeyList.length > 0 &&  nextValList.length > 0  && has !== -1) {
            filter(nextKeyList, value, nextValList)
          }
          // 否则就是不满足条件的
        })
      }
    }

    const handleClick = (val, key, disabel) => {
      if (disabel) { return false }
      if ( checkData[key] === val) {
        checkData[key]=''
      } else {
        checkData[key] = val
      }
    }


    return {
      fliterkeyList,
      handleClick,
      realFliterList,
      checkData
    }
  }
})
</script>

<style lang="less">
  .test-box{
    width: 100%;
    height: 1000px;
    padding: 40px;
    background: #f2f2f2;

    .list{
      display: flex;
      align-items: center;
      height: 100px;
      padding: 10px;
      margin-bottom: 20px;
      background: #fff;
      border-radius: 12px;

      .items-box{
        display: flex;
        align-items: center;
        
        .items{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100px;
          height: 50px;
          margin-right: 20px;
          cursor: pointer;
          border: 1px solid #f2f2f2;
          border-radius: 10px;
  
          &.active{
            border: 1px solid orangered;
          }
  
          &.disabel{
            cursor: not-allowed;
            background: #999;
          }
        }
      }
      
    }
  }
</style>