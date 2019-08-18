<template>
    <Page>

        <template v-slot:med_page_body>

            <BookPopup v-if="isPopupDisplayed" :bookId="bookPopupElementId" v-on:popup-wanna-close="closePopup"
                       v-on:book-saved="bookSaved"></BookPopup>

            <List ref="list" :apiEndpoint="'/api/books'" :cols="listCols" :colsProperties="listColsProperties"
                  :rowActions="rowActions" v-on:custom-action-triggered="customActionTriggered"
                  v-on:list-action-add="newBook" v-on:list-action-set="setBook"/>

        </template>
    </Page>
</template>

<script>
    import Page from './../Page';
    import List from './../../list/List';
    import Book from './../../../assets/js/book';

    import store from '../../../assets/js/store';
    import BookModule from '../../../assets/js/store/book';

    if (!store.state['book']) {
        store.registerModule('book', BookModule);
    }

    export default {
        name: "Book",
        components: {
            Page,
            List,
            BookPopup: () => import('./book/BookPopup')
        },
        data: function () {
            return {
                isPopupDisplayed: false,
                bookPopupElementId: null,
                listCols: {
                    'Titre': 'title',
                    'Année': 'year',
                    'Langue': 'language',
                    'Auteur': {'authors': ['firstname', 'lastname']}
                },
                listColsProperties: {
                    'Auteur': {'sort': false, 'searchName': ['author']}
                },
                rowActions: {
                    'download': {
                        'label': '',
                        'class': 'fas fa-file-download',
                        'getIsDisplayed': function (book) {
                            return (typeof book.ebook != 'undefined');
                        }
                    },
                    'delete': {
                        'label': '',
                        'class': 'far fa-trash-alt',
                        'confirm': 'Re-cliquez pour confirmer la suppression'
                    }
                }
            }
        },
        methods: {
            newBook: function () {
                this.bookPopupElementId = null;
                this.isPopupDisplayed = true;
            },
            setBook: function (bookId) {
                this.bookPopupElementId = bookId;
                this.isPopupDisplayed = true;
            },
            customActionTriggered: function (action, bookId) {
                switch (action) {
                    case 'download':
                        Book.downloadEBook(bookId);
                        break;
                    case 'delete':
                        this.$store.dispatch('deleteBook', bookId)
                            .then(() => {
                                this.$refs.list.load();
                            });
                        break;
                }
            },
            bookSaved: function () {
                this.bookPopupElementId = null;
                this.closePopup();
            },
            closePopup: function () {
                this.$refs.list.load();
                this.isPopupDisplayed = false;
            }
        },
        store
    }
</script>

<style scoped>

</style>