<template>
    <Page>
        <template v-slot:med_page_body>

            <AuthorPopup v-if="isPopupDisplayed" :author-id="authorPopupElementId"
                         v-on:popup-wanna-close="closePopup"></AuthorPopup>

            <List ref="list" apiEndpoint="/api/authors" :cols="listCols" v-on:list-action-set="setAuthor"
                  v-on:list-action-add="newAuthor"/>

        </template>
    </Page>
</template>

<script>
    import Page from './../Page';
    import List from './../../list/List';

    import store from '../../../assets/js/store';
    import AuthorModule from '../../../assets/js/store/author';
    import AuthorPopup from "./author/AuthorPopup";

    if (!store.state['author']) {
        store.registerModule('author', AuthorModule);
    }

    export default {
        name: "Author",
        components: {
            AuthorPopup,
            Page,
            List,
        },
        data() {
            return {
                isPopupDisplayed: false,
                authorPopupElementId: null,
                listCols: {
                    'Nom': 'lastname',
                    'Prénom': 'firstname',
                }
            }
        },
        methods: {
            setAuthor(authorId) {
                this.authorPopupElementId = authorId;
                this.isPopupDisplayed = true;
            },
            newAuthor() {
                this.authorPopupElementId = null;
                this.isPopupDisplayed = true;
            },
            closePopup() {
                this.$refs.list.load();
                this.isPopupDisplayed = false;
            }
        },
        store
    }
</script>

<style scoped>

</style>