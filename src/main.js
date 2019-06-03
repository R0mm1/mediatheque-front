import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/login', component: () => import('./components/pages/pages/Login')},
        {path: '/book', component: () => import('./components/pages/pages/Book')}
    ]
});

new Vue({
    render: h => h(App),
    router: router
}).$mount('#app');
