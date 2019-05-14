import Xhr from '../xhr';

const BookModule = {
    state() {
        return {
            book: {
                authors: []
            },
            flags: {
                isModified: false
            }
        }
    },
    mutations: {
        setBook(state, book) {
            state.book = book;
        },
        setProperty(state, {propertyName, value}) {

            if (propertyName === 'pageCount') value = parseInt(value);

            state.book[propertyName] = value;
            state.flags.isModified = true;
        },
        addAuthor(state, author) {
            let authorAtIndex = this.getters.hasAuthor(author['@id']);
            if (authorAtIndex === false) {
                state.book.authors.push(author);
                state.flags.isModified = true;
            }
        },
        removeAuthor(state, author) {
            let authorAtIndex = this.getters.hasAuthor(author['@id']);
            if (authorAtIndex !== false) {
                state.book.authors.splice(authorAtIndex, 1);
                state.flags.isModified = true;
            }
        }
    },
    getters: {
        getProperty: (state) => (propertyName) => {
            if (state.book !== null && state.book[propertyName]) {
                return state.book[propertyName];
            }
            return '';
        },
        getFlag: (state) => (flagName) => {
            if (state.flags[flagName]) {
                return state.flags[flagName];
            }
            return null;
        },
        hasAuthor: (state) => (authorIRI) => {
            let atIndex = false;
            state.book.authors.forEach((author, index) => {
                if (author.isPrototypeOf(String)) {
                    if (author === authorIRI) atIndex = index;
                } else {
                    if (author['@id'] && author['@id'] === authorIRI) atIndex = index;
                }
            });
            return atIndex;
        }
    },
    actions: {
        loadBook(context, bookId) {
            return new Promise((resolve) => {
                Xhr.buildGetUrl('/api/books/' + bookId)
                    .then(url => {
                        return Xhr.fetch(url, {});
                    })
                    .then(data => {
                        context.commit('setBook', data);
                        return resolve();
                    })
            });
        },
        setCover(context, {file}) {
            return Xhr.buildGetUrl('/api/book/covers')
                .then(url => {
                    return Xhr.sendFile(file, url);
                })
                .then(fileData => {
                    context.commit('setProperty', {
                        propertyName: 'cover',
                        value: '/api/files/' + fileData.id
                    });
                    return Promise.resolve(fileData['@id']);
                });
        },
        saveBook(context) {
            let bookId = context.getters.getProperty('id');

            let method = (typeof bookId === 'number') ? 'PUT' : 'POST';
            let url = '/api/books' + (method === 'PUT' ? '/' + bookId : '');

            return Xhr.buildGetUrl(url)
                .then(url => {
                    return Xhr.fetch(url, {
                        method: method,
                        headers: new Headers({'Content-Type': 'application/json'}),
                        body: JSON.stringify(context.state.book)
                    })
                });
        },
        deleteBook(context, bookId) {
            if (!bookId) bookId = context.getters.getProperty('id');
            if ((typeof bookId === 'string' && bookId.length === 0) || typeof bookId !== 'number') throw "Book id invalid";

            return Xhr.buildGetUrl('/api/books/' + bookId)
                .then(url => {
                    return Xhr.fetch(url, {
                        method: 'DELETE'
                    });
                });
        }
    },
};

export default BookModule;