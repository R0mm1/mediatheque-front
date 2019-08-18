import UserCommon from './common';
import Xhr from "../../xhr";
import Vue from 'vue';

const LoggedInModule = {
    namespaced: true,
    state() {
        return {
            ...UserCommon.state()
        };
    },
    getters: {
        ...UserCommon.getters
    },
    mutations: {
        ...UserCommon.mutations
    },
    actions: {
        load(context) {
            return Xhr.buildGetUrl('/api/users/loggedIn')
                .then(url => {
                    return Xhr.fetch(url, {
                        method: 'GET'
                    });
                })
                .then(user => {
                    Vue.set(context.state, 'user', user);
                })
                .catch(error=>{
                    console.error(error);
                });
        },
        ...UserCommon.actions
    }
};

export default LoggedInModule;