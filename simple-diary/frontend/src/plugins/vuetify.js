import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const opts = {
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    themes: {
      light: {
        primary: '#0052cc',
        secondary: '#ffa700', // #FFCDD2
        accent: '#3F51B5',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      },
    },
  },
  // https://vuetifyjs.com/en/features/breakpoints/#breakpoint-service
  breakpoint: {
    // thresholds: {
    //   xs: 340,
    //   sm: 540,
    //   md: 800,
    //   lg: 1280,
    // },
    scrollbarWidth: 12,
  },
};

export default new Vuetify(opts);
