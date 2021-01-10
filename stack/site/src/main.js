
import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');


// import Vue from 'vue'
// import vuetify from '@/plugins/vuetify' // path to vuetify export

// new Vue({
//   vuetify,
// }).$mount('#app')
