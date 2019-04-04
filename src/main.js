import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.config.productionTip = false;
Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '/login', component: () => import('./components/Login')}
    ]
});

new Vue({
    render: h => h(App),
    router: router
}).$mount('#app');
