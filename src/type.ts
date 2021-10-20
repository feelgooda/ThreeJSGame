export interface rules {
  trigger?: string,
  enum?: string,
  len?: number,
  max?: number,
  message?: string,
  min?: number,
  pattern?: RegExp,
  required?: boolean,
  transform?: <T>(transformedValue:T) => T,
  type?: string,
  validator?: (rule:any, value:any, callback:Function) => void,
  whitespace?: boolean
}
export interface paramsType{
  formKey: string,
  value?: any,
  label?: string,
  rule?: rules[] | rules,
  placeholder?: string,
  slot?: string,
  component: string,
  componentProps?: object | (() => object),
}
export interface back{
  register: Function,
  getFieldsValue: Function
}
export interface Method {
  handleSubmit?: Function,
  setFieldsValue?: Function,
  clearValidate?: Function,
  validate?: Function,
  validateFields?: Function,
  getFieldsValue: Function,
  updateSchema: Function,
  appendSchemaByField?: Function,
  removeSchemaByFiled?: Function,
  resetFields?: Function,
  scrollToField?: Function,
}
