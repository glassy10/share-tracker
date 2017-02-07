// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import vueResource from 'vue-resource'
import router from './router'
import App from './App'
var _ = require('lodash');
Vue.use(vueResource)

/* eslint-disable no-new */
const app = new Vue({
    ...App,
    router
}).$mount('#app')

 
// const app = new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: { App,router }
// }).$mount('#app')
