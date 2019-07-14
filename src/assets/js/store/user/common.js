import Xhr from '../../xhr';

const UserCommon = {
    state() {
        return {
            user: null
        }
    },
    getters: {
        getProperty: (state) => (propertyName) => {
            console.log(propertyName);
            if (state.user !== null && state.user[propertyName]) {
                return state.user[propertyName];
            }
            return '';
        },
    },
    mutations: {
        setUser: (state) => (user) => {
            state.user = user;
        }
    },
    actions: {
        setPassword(context, newPassword) {
            if (!context.state.user.id) throw 'User not loaded';

            return Xhr.buildGetUrl('/api/users/' + context.state.user.id)
                .then(url => {
                    return Xhr.fetch(url, {
                        method: 'PUT',
                        headers: new Headers({'Content-Type': 'application/json'}),
                        body: JSON.stringify({
                            plainPassword: newPassword
                        })
                    });
                });
        }
    }
};

export default UserCommon;