import {container} from 'tsyringe';
import RequestService from "../../ts/service/RequestService";
import Vue from 'vue';
import MedFile from '../medFile';

const requestService = container.resolve(RequestService);

const BookModule = {
    namespaced: true,
    state() {
        return {
            book: {
                authors: []
            },
            userNotation: null,
            flags: {
                isModified: false,
                isElectronic: false
            },
            eBookToDelete: null
        }
    },
    mutations: {
        unload(state) {
            Vue.set(state, 'book', {
                authors: []
            });
            Vue.set(state.flags, 'isElectronic', false);
            Vue.set(state.flags, 'isModified', false);
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
            let authorAtIndex = this.getters['book/hasAuthor'](author['@id']);
            if (authorAtIndex === false) {
                state.book.authors.push(author);
                state.flags.isModified = true;
            }
        },
        removeAuthor(state, author) {
            let authorAtIndex = this.getters['book/hasAuthor'](author['@id']);
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
            Vue.set(state.book, 'owner', '/users/' + userId);
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
                if (Object.prototype.isPrototypeOf.call(author, String)) {
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
            const request = requestService.createRequest('/books/' + bookId);

            return requestService.execute(request)
                .then(data => {
                    return Promise.resolve(context.dispatch('setBook', data));
                });
        },

        setBook({state}, book) {

            let promise = Promise.resolve();

            if (typeof book.electronicBook === 'string') {
                promise = promise
                    .then(() => {
                        const request = requestService.createRequest(book.electronicBook + '/raw');
                        return requestService.execute(request);
                    })
                    .then(electronicBookRawData => {
                        return Promise.resolve(book.electronicBook = new MedFile(null, electronicBookRawData['name'], electronicBookRawData['id'], false));
                    })
            }

            return promise.then(() => {
                Vue.set(state, 'book', book);
                Vue.set(state.flags, 'isElectronic', book.electronicBook instanceof MedFile);
                Vue.set(state.flags, 'isModified', false);
            });
        },
        setCover(context, {file}) {
            return requestService.sendFile(file, '/book/covers')
                .then(fileData => {
                    context.commit('setProperty', {
                        propertyName: 'cover',
                        value: '/book/covers/' + fileData.id
                    });
                    return Promise.resolve(fileData['@id']);
                });
        },
        saveBook(context) {
            let bookId = context.getters.getProperty('id');

            let method = (typeof bookId === 'number') ? 'PUT' : 'POST';
            let url = '/books' + (method === 'PUT' ? '/' + bookId : '');
            let promise = Promise.resolve();

            if (context.getters.getFlag('isElectronic') === false) {
                context.commit('deleteRelatedEbook');
            }

            //Create new ebook, if needed
            let electronicBook = context.state.book.electronicBook;
            if (electronicBook instanceof MedFile && electronicBook.isNew) {
                promise = promise
                    .then(() => requestService.sendFile(electronicBook.file, '/electronic_books'))
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
            return promise
                .then(() => {

                    if (context.state.book.electronicBook instanceof MedFile) {
                        context.commit('setProperty', {
                            propertyName: 'electronicBook',
                            value: '/electronic_books/' + context.state.book.electronicBook.id
                        });
                    }

                    const request = requestService.createRequest(url, method)
                        .addHeader('Content-Type', 'application/json')
                        .setBody(context.state.book);
                    return requestService.execute(request);
                })
                .then(book => {
                    context.dispatch('setBook', book);

                    //Delete old ebook if needed
                    if (context.state.eBookToDelete !== null) {
                        const request = requestService.createRequest('electronic_books/' + context.state.eBookToDelete, 'DELETE');
                        requestService.execute(request)
                            .then(() => {
                                context.state.eBookToDelete = null;
                            });
                    }
                });
        },
        deleteBook(context, bookId) {
            if (!bookId) bookId = context.getters.getProperty('id');
            if ((typeof bookId === 'string' && bookId.length === 0) || typeof bookId !== 'number') throw "Book id invalid";

            const request = requestService.createRequest('/books/' + bookId, 'DELETE');
            return requestService.execute(request);
        },
        downloadEbook(context) {
            let file = context.state.book.electronicBook;
            if (file instanceof MedFile) {
                const request = requestService.createRequest('book_files/' + file.id);
                return requestService.execute(request)
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
