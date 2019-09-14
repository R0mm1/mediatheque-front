import Xhr from "../xhr";

const BookNotationModule = {
    namespaced: true,
    state() {
        return {
            endpoint: '/api/book_notations',
            item: null
        }
    },
    getters: {
        get(state) {
            return state.item;
        },
        getProperty: (state) => (property) => {
            if (state.item === null ||
                typeof state.item === 'undefined' ||
                typeof state.item[property] === 'undefined') {
                return null;
            }
            return state.item[property];
        }
    },
    mutations: {
        set(state, bookNotation) {
            state.item = bookNotation;
        },
        setProperty(state, {property, value}) {
            if (typeof state.item[property] !== 'undefined') {
                state.item[property] = value;
            }
        },
        create(state, {bookId, note}) {
            state.item = {
                book: '/api/books/' + bookId,
                note: note
            };
        }
    },
    actions: {
        load({state, commit}, {params, method}) {
            return Xhr.buildGetUrl(state.endpoint, params)
                .then(url => Xhr.fetch(url, {
                        method: method
                    })
                )
                .then(bookNotation => {
                    commit('set', bookNotation['hydra:member'][0]);
                });
        },
        findById({dispatch}, id) {
            return dispatch('load', {params: {id: id}, method: 'GET'});
        },
        findByBook({dispatch}, bookId) {
            return dispatch('load', {params: {'book.id': bookId}, method: 'GET'});
        },
        save({state, commit}) {
            const isCreation = typeof state.item['id'] === 'undefined';
            const method = isCreation ? 'POST' : 'PUT';
            const url = state.endpoint + (isCreation ? '' : '/' + state.item['id']);
            return Xhr.buildGetUrl(url)
                .then(url => {
                    return Xhr.fetch(url, {
                        method: method,
                        headers: new Headers({'Content-Type': 'application/json'}),
                        body: JSON.stringify(state.item)
                    });
                })
                .then(response => {
                    commit('set', response);
                });
        },
    }
};

export default BookNotationModule;
