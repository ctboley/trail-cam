import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')


// import Vue from 'vue'
// import vuetify from '@/plugins/vuetify' // path to vuetify export

// new Vue({
//   vuetify,
// }).$mount('#app')