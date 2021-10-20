<template>
  <div>
    <!-- <div class="text">盒子 {{ref2.name}}</div> -->
    <div class="box">
      <!-- <Test  :fliterList="filterList" :realList="ruleList" /> -->
    <!-- <Child/> -->
    <Game/>
    <!-- <Echarts/> -->
    <!-- <Drag/> -->
    </div>
    <!-- <Render>
      <template #default>
        我是render里的插槽
      </template>
    </Render> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, provide } from 'vue'
import Child from './components/child.vue'
import Game from './components/game.vue'
import Echarts from './components/echarts.vue'
import Drag from './components/drag.vue'
import Test from './components/test.vue'
import Render from './components/render'
import { ruleList, filterList } from './components/json'
export default defineComponent({
  components:{
    Child,
    Render,
    Game,
    Echarts,
    Drag,
    Test
  },
  setup() {
    console.log(filterList, 'xxxxxxxxxxxxx')
    const ref2: any = reactive({
      name: 'zlz',
      age: 24
    })
    const update = (key: string, val: any): void => {
      ref2[key] = val
    }

    provide('ref2', {
      val: ref2,
      update
    })

    const filterData = {

    }

    return {
      ref2,
      ruleList,
      filterList
    }
  }
})
</script>

