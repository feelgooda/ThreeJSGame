<template>
  <div class="test-box">
    <div class="list">
      <div :class="['items', {active: color === val.value, disabel: val.disabel }]" 
        v-for="val in showColor" 
        :key="val.value"
        @click="handleClick(val.value, 'color', val.disabel)"
      >
        {{val.label}}
      </div>
    </div>
    <div class="list">
      <div :class="['items', {active: size === val.value, disabel: val.disabel }]" 
        v-for="val in showSize" 
        :key="val.value"
        @click="handleClick(val.value, 'size', val.disabel)"
      >
        {{val.label}}
      </div>
    </div>
    <div class="list">
      <div :class="['items', {active: big === val.value, disabel: val.disabel }]" 
        v-for="val in showBig" 
        :key="val.value"
        @click="handleClick(val.value, 'big', val.disabel)"
      >
        {{val.label}}
      </div>
    </div>
    <div class="list">
      <div :class="['items', {active: brand === val.value, disabel: val.disabel }]" 
        v-for="val in showBrand" 
        :key="val.value"
        @click="handleClick(val.value, 'brand', val.disabel)"
      >
        {{val.label}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive,  ref, computed, toRefs } from 'vue'

export default defineComponent({
  setup () {
    const colorList = [
      { label: '蓝色', value: 'blue', disabel: true },
      { label: '绿色', value: 'green', disabel: true },
      { label: '黄色', value: 'orange', disabel: true },
    ]
    const sizeList = [
      { label: '大', value: 'max', disabel: true },
      { label: '中', value: 'mindle', disabel: true },
      { label: '小', value: 'min', disabel: true },
    ]
    const bigList = [
      { label: '16G', value: '2', disabel: true },
      { label: '8G', value: '1', disabel: true },
      { label: '4G', value: '0', disabel: true },
    ]
    const brandList = [
      { label: '微星', value: 'wx', disabel: true },
      { label: '华硕', value: 'hs', disabel: true },
      { label: '三星', value: 'sx', disabel: true },
      { label: '七彩虹', value: 'qch', disabel: true },
    ]

    const realList = [ // 可选配置
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
    ]

    const checkData = reactive({
      color: '',
      size: '',
      big: '',
      brand: ''
    })

    const showColor =  computed(() => {
      const list = handleFilter(colorList, 'color')
      return list
    })

    const showSize =  computed(() => {
      const list = handleFilter(sizeList, 'size')
      return list
    })

    const showBig =  computed(() => {
      const list = handleFilter(bigList, 'big')
      return list
    })

    const showBrand =  computed(() => {
      const list = handleFilter(brandList, 'brand')
      return list
    })

    const handleFilter = (handleList, key) => {
      console.log(1)
      const copeList = JSON.parse(JSON.stringify(handleList))
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

      return copeList
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
      // setTimeout(() => {
      //   console.log(showColor.value, 'xxxxxx')
      // }, 100);
    }


    return {
      showColor,
      showSize,
      showBig,
      showBrand,
      handleClick,
      ...toRefs(checkData)
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
      height: 100px;
      align-items: center;
      padding: 10px;
      margin-bottom: 20px;
      background: #fff;
      border-radius: 12px;
      
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
</style>