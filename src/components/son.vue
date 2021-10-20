<template>
  <div class="container">
    <UseForm @register="register">
      <template #slot="{ form, itemData }">
        <a-switch v-model:checked="form[itemData.formKey]" />
      </template>
    </UseForm>
    <button @click="getVal">获取表单值</button>
  </div>
</template>

<script lang="ts">
import { inject, ref, watchEffect, shallowReactive } from 'vue'
import UseForm from './useForm.vue'
import { useForm } from '../utils/useForm'

export default {
  components: {
    UseForm
  },
  setup(_, {attrs, slots}) {
    const { register, getFieldsValue } = useForm([
      {
        formKey: 'test',
        component: 'input',
        value: '1234',
        label: '这是测试',
        rule: [{ required: true, message: '规则测试', trigger: 'change' }],
        componentProps: {
          '@change': () => {
            console.log(1)
          }
        }
      },
      {
        formKey: 'name',
        component: 'input',
        value: 'zlz',
        label: '姓名',
        rule: [{ required: true, message: '规则测试a-z', trigger: 'change', pattern: /^[a-z]$/ }],
        componentProps: {}
      },
      {
        formKey: 'slot',
        component: 'input',
        slot: 'slot',
        value: 'slot',
        label: '我是自定义slot',
        rule: [{ required: true, trigger: 'change', validator: (rule, value) => {
          console.log(value, '----')
          return new Promise((resole, reject) => {
            if (value) {
              resole(value)
            } else {
              reject('必须选同意')
            }
          })
        } }],
        componentProps: {}
      }
    ])
    const getVal = () => {
      const val = getFieldsValue() // 双线绑定的 可修改
    }
    return {
      register,
      getVal
    }
  }
}
</script>
