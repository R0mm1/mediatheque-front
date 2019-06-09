import Xhr from '../xhr';
import Vue from 'vue';
import MedFile from '../medFile';

const BookModule = {
    state() {
        return {
            book: {
                authors: []
            },
            flags: {
                isModified: false,
                isElectronic: false
            },
            eBookToDelete: null
        }
    },
    mutations: {
        setBook(state, book) {

            let promise = Promise.resolve();

            if (typeof book.electronicBook === 'string') {
                promise = promise
                    .then(() => {
                        return Xhr.buildGetUrl(book.electronicBook + '/raw');
                    })
                    .then(url => {
                        return Xhr.fetch(url, {});
                    })
                    .then(electronicBookRawData => {
                        return new Promise(resolve => {
                            resolve(book.electronicBook = new MedFile(null, electronicBookRawData['name'], electronicBookRawData['id'], false));
                        });
                    })
            }

            promise.then(() => {
                Vue.set(state, 'book', book);
                Vue.set(state.flags, 'isElectronic', book.electronicBook instanceof MedFile);
            });

        },
        setProperty(state, {propertyName, value}) {

            if (propertyName === 'pageCount') value = parseInt(value);

            Vue.set(state.book, propertyName, value);
            state.flags.isModified = true;
        },
        setFlag(state, {flagName, value}) {
            Vue.set(state.flags, flagName, value);
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
        },
        deleteRelatedEbook(state) {
            if (state.book.electronicBook instanceof MedFile && state.book.electronicBook.isNew === false) {
                state.eBookToDelete = state.book.electronicBook.id;
            }
            Vue.set(state.book, 'electronicBook', null);
        },
        setOwner(state, userId) {
            Vue.set(state.book, 'owner', '/api/users/' + userId);
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
            if (typeof state.flags[flagName] !== 'undefined') {
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
            return Xhr.buildGetUrl('/api/books/' + bookId)
                .then(url => {
                    return Xhr.fetch(url, {});
                })
                .then(data => {
                    return new Promise(resolve => {
                        resolve(context.commit('setBook', data));
                    });
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
                        value: '/api/book/covers/' + fileData.id
                    });
                    return Promise.resolve(fileData['@id']);
                });
        },
        saveBook(context) {
            let bookId = context.getters.getProperty('id');

            let method = (typeof bookId === 'number') ? 'PUT' : 'POST';
            let url = '/api/books' + (method === 'PUT' ? '/' + bookId : '');
            let promise = Promise.resolve();

            if (context.getters.getFlag('isElectronic') === false) {
                context.commit('deleteRelatedEbook');
            }

            //Create new ebook, if needed
            let electronicBook = context.state.book.electronicBook;
            if (electronicBook instanceof MedFile && electronicBook.isNew) {
                promise = promise
                    .then(() => {
                        return Xhr.buildGetUrl('/api/electronic_books');
                    })
                    .then(url => {
                        return Xhr.sendFile(electronicBook.file, url);
                    })
                    .then(electronicBookData => {
                        return new Promise((resolve => {
                            electronicBook.id = electronicBookData['id'];
                            resolve(context.commit('setProperty', {
                                propertyName: 'electronicBook',
                                value: electronicBook
                            }));
                        }));
                    });
            }

            //Save book
            promise
                .then(() => {

                    if (context.state.book.electronicBook instanceof MedFile) {
                        context.commit('setProperty', {
                            propertyName: 'electronicBook',
                            value: '/api/electronic_books/' + context.state.book.electronicBook.id
                        });
                    }

                    return Xhr.buildGetUrl(url);
                })
                .then(url => {
                    return Xhr.fetch(url, {
                        method: method,
                        headers: new Headers({'Content-Type': 'application/json'}),
                        body: JSON.stringify(context.state.book)
                    })
                })
                .then(book => {
                    context.commit('setBook', book);

                    //Delete old ebook if needed
                    if (context.state.eBookToDelete !== null) {
                        Xhr.buildGetUrl('/api/electronic_books/' + context.state.eBookToDelete)
                            .then(url => {
                                Xhr.fetch(url, {
                                    method: 'DELETE'
                                });
                            })
                            .then(() => {
                                context.state.eBookToDelete = null;
                            })
                    }
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
        },
        downloadEbook(context) {
            let file = context.state.book.electronicBook;
            if (file instanceof MedFile) {
                Xhr.buildGetUrl('/api/electronic_books/' + file.id)
                    .then(url => {
                        return Xhr.fetch(url, {
                            method: 'GET'
                        });
                    })
                    .then(response => new Response(response.body))
                    .then(response => response.blob())
                    .then(blob => URL.createObjectURL(blob))
                    .then(url => {
                        let a = document.createElement('a');
                        a.href = url;
                        a.download = file.name;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    });
            }
        }
    },
};

export default BookModule;