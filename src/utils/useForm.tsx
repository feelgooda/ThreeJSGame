import { ref, reactive, toRefs } from 'vue'
import { rules, paramsType, back, Method  } from '@/type'

function useForm(params:paramsType[]):back{
  let state = reactive<Method>({
    updateSchema: () => {},
    getFieldsValue: ()=> {}
  })
  const getFieldsValue = () => {
    return state.getFieldsValue()
  }
  const register = ({ updateSchema, getFieldsValue: getFields }:Method) => {
    updateSchema(params)
    state.getFieldsValue = getFields as () => void
  }
  return {
    register,
    getFieldsValue
  }
}

export {
  useForm
}