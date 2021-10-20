import { withModifiers, defineComponent, ref } from "vue";

const App = defineComponent({
  setup() {
    const count = ref(6);

    const inc = () => {
      count.value++
    };
    const obj = {
      type: 'name',
      help: 'cc',
      'onClick': () => {
        console.log('我被点击了')
        count.value++
      }
    }
    return () => (
      <div {...obj}>{count.value}</div>
    );
  },
});

export default App