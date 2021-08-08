import Vue from 'vue';

import TimePicker from '@/components/TimePicker.vue';

export default {
  setup() {
    Vue.component('my-time-picker', TimePicker);
  },
};
