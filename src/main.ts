const config = require('../mediatheque');

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.config.productionTip = false;

//--- ROUTING ---//
Vue.use(VueRouter);

import store from './assets/js/store';
import UserModule from './assets/js/store/user/loggedIn';

if (!store.state['user']) {
    store.registerModule('user', UserModule);
}

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            name: 'root',
            path: '/',
            beforeEnter: (to, from, next) => {
                store.dispatch('user/load')
                    .then(() => {
                        if (typeof store.getters['user/getProperty']('id') === 'number') {
                            next({path: config.default.page})
                        } else {
                            next({name: 'login'})
                        }
                    });
            }
        },
        {name: 'login', path: '/login', component: () => import('./components/pages/pages/Login.vue')},
        {name: 'account', path: '/account', component: () => import('./components/pages/pages/Account.vue')},
        {name: 'book', path: '/book', component: () => import('./components/pages/pages/Book.vue')},
        {name: 'author', path: '/author', component: () => import('./components/pages/pages/Author.vue')}
    ]
});

//--- NOTIFICATION ---//
import Toasted from 'vue-toasted'

import vuetify from './plugins/vuetify';

Vue.use(Toasted);

new Vue({
    render: h => h(App),
    vuetify,
    router: router
}).$mount('#app');
