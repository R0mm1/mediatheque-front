<template>
    <Page>
        <template v-slot:med_page_body>

            <AuthorPopup v-if="isPopupDisplayed" :author-id="authorPopupElementId"
                         v-on:popup-wanna-close="closePopup"></AuthorPopup>

            <List ref="list" apiEndpoint="/api/authors" :cols="cols"
                  v-on:list-action-set="setAuthor"
                  v-on:list-action-add="newAuthor"/>

        </template>
    </Page>
</template>

<script>
    import Page from './../Page';
    import List from './../../list/List';

    import AuthorPopup from "./author/AuthorPopup";
    import Column from "../../../assets/ts/list/Column";

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
                cols: [
                    new Column('lastname', 'Nom'),
                    new Column('firstname', 'Prénom')
                ]
            }
        },
        methods: {
            setAuthor(author) {
                this.authorPopupElementId = author.id;
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
        }
    }
</script>

<style scoped>

</style>
