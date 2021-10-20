import { defineComponent, onMounted ,reactive, ref, render, toRef, toRefs } from 'vue'
import { rules, paramsType, back, Method  } from '@/type'
import { FormItem, Input } from 'ant-design-vue'

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
    const name = ref('123') 
    // onMounted(() => {
    //   if (refItem.value) {
    //     refItem.value.setAttribute
    //   }
    // })
    console.log(items, '------------------')
    return() => (
      <>
        <FormItem label={items.value.label} name={items.value.formKey} rules={items.value.rule}>
          {
            !items.value.slot && 
            <template>
              { items.value.component === 'input' &&
                <template>
                <Input
                  ref="refItem"
                  v-model:value="form[items.formKey]"
                  placeholder={items.value.placeholder || `请输入${items.value.label}`}
                  />
                </template>
              }
            </template>
          }
          { items.value.slot &&
            <slot name={items.value.slot} form={form} itemData={items}></slot>
          }
        </FormItem>
      </>
    )
  }
})