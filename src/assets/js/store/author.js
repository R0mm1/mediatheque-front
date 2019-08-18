import Xhr from '../xhr';

const AuthorModule = {
    namespaced: true,
    state() {
        return {
            author: {},
            flags: {
                isModified: false
            },
            defaultData: {}
        }
    },
    mutations: {
        init(state) {
            state.author = state.defaultData;
        },
        setAuthor(state, author) {
            state.author = author;
        },
        setProperty(state, {propertyName, value}) {
            state.author[propertyName] = value;
            state.flags.isModified = true;
        }
    },
    getters: {
        getProperty: (state) => (propertyName) => {
            if (state.author !== null && state.author[propertyName]) {
                return state.author[propertyName];
            }
            return '';
        },
        getFlag: (state) => (flagName) => {
            if (state.flags[flagName]) {
                return state.flags[flagName];
            }
            return null;
        }
    },
    actions: {
        load(context, authorId) {
            return new Promise((resolve) => {
                Xhr.buildGetUrl('/api/authors/' + authorId)
                    .then(url => {
                        return Xhr.fetch(url, {});
                    })
                    .then(data => {
                        context.commit('setAuthor', data);
                        return resolve();
                    })
            });
        },
        save(context) {
            let authorId = context.getters.getProperty('id');

            let method = (typeof authorId === 'number') ? 'PUT' : 'POST';
            let url = '/api/authors' + (method === 'PUT' ? '/' + authorId : '');

            return Xhr.buildGetUrl(url)
                .then(url => {
                    return Xhr.fetch(url, {
                        method: method,
                        headers: new Headers({'Content-Type': 'application/json'}),
                        body: JSON.stringify(context.state.author)
                    })
                });
        }
    },
};

export default AuthorModule;