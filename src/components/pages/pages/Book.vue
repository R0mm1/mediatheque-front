<template>
    <Page>

        <template v-slot:med_page_body>

            <BookPopup v-if="isPopupDisplayed" :bookId="bookPopupElementId" v-on:popup-wanna-close="closePopup"
                       v-on:book-saved="bookSaved"></BookPopup>

            <List ref="list" apiEndpoint="/api/books" :cols="cols"
                  :rowActions="rowActions" v-on:custom-action-triggered="customActionTriggered"
                  v-on:list-action-add="newBook" v-on:list-action-set="setBook"/>

        </template>
    </Page>
</template>

<script>
    import Column from "../../../assets/ts/list/Column";
    import DataSubProperty from "../../../assets/ts/list/DataSubProperty";
    import RowAction from "../../../assets/ts/list/RowAction";

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
                bookHasBeenModified: false,
                cols: [
                    new Column('title', 'Titre'),
                    new Column('year', 'Année'),
                    new Column('language', 'Langue'),
                    new Column('authors', 'Auteurs')
                        .setSearchParameterName('authorFullname')
                        .setSubProperties([
                            new DataSubProperty('firstname'),
                            new DataSubProperty('lastname')
                        ])
                ],
                rowActions: [
                    new RowAction('download', '', 'fas fa-file-download')
                        .setIsDisplayed(book => {
                            return typeof book.electronicBook === 'string'
                                && book.electronicBook.length > 0;
                        }),
                    new RowAction('delete', '', 'far fa-trash-alt')
                        .setNeedConfirm(true, 'Re-cliquez pour confirmer la suppression')
                ]
            }
        },
        methods: {
            newBook: function () {
                this.bookPopupElementId = null;
                this.isPopupDisplayed = true;
            },
            setBook: function (bookId) {
                this.bookPopupElementId = bookId;
                this.bookHasBeenModified = false;
                this.isPopupDisplayed = true;
            },
            customActionTriggered(action, bookId) {
                switch (action) {
                    case 'download':
                        this.$store.dispatch('book/loadBook', bookId)
                            .then(() => {
                                this.$store.dispatch('book/downloadEbook')
                            });
                        break;
                    case 'delete':
                        this.$store.dispatch('book/deleteBook', bookId)
                            .then(() => {
                                this.$refs.list.load();
                            });
                        break;
                }
            },
            bookSaved: function () {
                this.bookHasBeenModified = true;
            },
            closePopup: function () {
                if (this.bookHasBeenModified === true) {
                    this.$refs.list.load();
                }
                this.isPopupDisplayed = false;
            }
        },
        store
    }
</script>

<style scoped>

</style>
