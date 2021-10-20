<template>
  <a-form-item :label="items.label" :name="items.formKey" :rules="items.rule">
    <template v-if="!items.slot">
        <template v-if="items.component === 'input'">
        <a-input
          ref="refItem"
          v-model:value="form[items.formKey]"
          :placeholder="items.placeholder || `请输入${items.label}`"
          />
        </template>
    </template>
    <slot v-else :name="items.slot" :form="form" :itemData="items"></slot>
  </a-form-item>
</template>

<script lang="ts">
import { defineComponent, onMounted ,reactive, ref, render, toRef, toRefs } from 'vue'
import { rules, paramsType, back, Method  } from '@/type'
export default defineComponent({
  emits: ['register'],
  props: {
    items: {
      default: ():paramsType => ({
        formKey: '', 
        component: ''
      })
    },
    form: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const { items, form } = toRefs(props)
    return {
      items,
      form
    }
  }
})
</script>





