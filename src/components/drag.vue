<template>
  <div class="drag-box">
    <Draggable
      :list="list"
      :animation="100"
      item-key="id"
      class="list-group"
      ghost-class="ghost"
      @change="onMoveCallback"
    >
      <template #item="{ element }">
        <div class="items">
          <div class="title">{{ element.label }}</div>
          <button @click.stop="fold(element)">{{element.isflod ? '展开' : '收起'}}</button>
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable
  },
  setup() {
    const list = ref([
      {
        label: '模块1',
        id: 1,
        isflod: false
      },
      {
        label: '模块2',
        id: 2,
        isflod: false
      },
      {
        label: '模块3',
        id: 3,
        isflod: false
      },
      {
        label: '模块4',
        id: 4,
        isflod: false
      },
      {
        label: '模块5',
        id: 5,
        isflod: false
      },
      {
        label: '模块6',
        id: 6,
        isflod: false
      },
    ])
    

    const onMoveCallback = (val) => {
      console.log(val, 'move==================')
    }

    const fold = (val) => {
      val.isflod = !val.isflod
    }
    return {
      list,
      fold,
      onMoveCallback
    }
  }
}
</script>

<style lang="less"  scoped>
  .drag-box{
    .items{
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 20px;
      margin-bottom: 20px;
      background: #e3e3e3;
      border-radius: 8px;
    }
  }
</style>
