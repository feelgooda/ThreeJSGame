<template>
  <a-form ref="refModel" :model="form" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
    <template v-for="val in itemList" :key="val.formKey">
      <FormItems :items="val" :form="form">
        <template #[val.slot]="{ form, itemData }" v-if="val.slot">
          <slot :name="val.slot" :form="form" :itemData="itemData"></slot>
        </template>
      </FormItems>
    </template>
  </a-form>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
// import FormItems from "./formItem.vue";
import FormItems from "./formItem";

interface paramsType {
  formKey: string;
  value?: any;
  label?: string;
  rule?: any[];
  slot?: string;
  component: string;
}

export default defineComponent({
  components: {
    FormItems,
  },
  emits: ["register"],
  setup(props, { emit }) {
    const refModel = ref()
    let itemList = ref([]) as any;
    let form = ref({}) as any;
    const updateSchema = (val: paramsType[]) => {
      const initForm: any = {};
      val.forEach((item) => {
        initForm[item.formKey] = item.value || "";
      });
      form.value = initForm;
      itemList.value = val;
    };
    const getFieldsValue = () => {
      return form.value
    }
    const Method = {
      updateSchema,
      getFieldsValue
    };
    onMounted(() => {
      emit("register", Method);
    });
    return {
      itemList,
      form,
      refModel
    };
  },
});
</script>
