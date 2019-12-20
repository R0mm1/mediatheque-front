<template>
    <Page>

        <template v-slot:med_page_body>

            <BookPopup v-if="isPopupDisplayed" :bookId="bookPopupElementId" :bookType="bookPopupElementType"
                       v-on:popup-wanna-close="closePopup"
                       v-on:book-saved="bookSaved"></BookPopup>

            <List ref="list" apiEndpoint="/api/books"
                  :cols="cols" :rowActions="rowActions"
                  :left-action-bar-properties="leftActionBarProperties"
                  :custom-filters="cCustomFilters"
                  v-on:custom-action-triggered="customActionTriggered"
                  v-on:list-action-set="setBook"/>

        </template>
    </Page>
</template>

<script>
    import Vue from 'vue';

    import Column from "../../../assets/ts/list/Column";
    import DataSubProperty from "../../../assets/ts/list/DataSubProperty";
    import RowAction from "../../../assets/ts/list/RowAction";

    import Page from './../Page';
    import List from './../../list/List';

    import store from '../../../assets/js/store';
    import BookModule from '../../../assets/js/store/book';
    import LeftActionBarElement from "../../../assets/ts/list/LeftActionBarElement";
    import LeftActionBarProperties from "../../../assets/ts/list/LeftActionBarProperties";
    import LeftActionBarSeparator from "../../../assets/ts/list/LeftActionBarSeparator";
    import LeftActionBarFormSelectDescriptor from "../../../assets/ts/list/LeftActionBarFormSelectDescriptor";
    import Filter from "../../../assets/ts/list/Filter";
    import ButtonDescriptor from "../../../assets/ts/form/ButtonDescriptor";

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
                bookPopupElementType: 'PaperBook',
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
                ],
                leftActionBarProperties: new LeftActionBarProperties([
                    new LeftActionBarSeparator('Ajouter', 'fas fa-plus'),
                    new LeftActionBarElement(
                        () => {
                            this.bookPopupElementType = 'PaperBook';
                            this.bookPopupElementId = null;
                            this.isPopupDisplayed = true;
                        },
                        new ButtonDescriptor('addPaper', 'Livre papier')
                    ),
                    new LeftActionBarElement(
                        () => {
                            this.bookPopupElementType = 'ElectronicBook';
                            this.bookPopupElementId = null;
                            this.isPopupDisplayed = true;
                        },
                        new ButtonDescriptor('addElectronic', 'Epub')
                    ),
                    new LeftActionBarSeparator('Filtres', 'fas fa-sliders-h'),
                    new LeftActionBarElement(
                        (bookType) => {
                            let customFilter = new Filter('bookType', bookType);
                            Vue.set(this.customFilters, customFilter.property, customFilter);
                        },
                        new LeftActionBarFormSelectDescriptor('bookType', {
                            'all': 'Tous',
                            'paper': 'Papier',
                            'electronic': 'Epub'
                        }).setValue('all').setFaIcon('fas fa-book')
                    )
                ], false),
                customFilters: {}
            }
        },
        computed: {
            cCustomFilters: function () {
                return Object.values(this.customFilters);
            }
        },
        methods: {
            setBook: function (selectedBook) {
                this.bookPopupElementId = selectedBook.id;
                this.bookPopupElementType = selectedBook['@type'];
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
