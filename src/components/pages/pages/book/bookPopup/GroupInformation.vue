<template>
    <Group>
        <template v-slot:group_name>
            Informations
        </template>
        <template v-slot:group_content>
            <Entities name="authors" label="Auteurs" :entities="cAuthors" :entity-fields="['firstname', 'lastname']"
                      entity-u-r-i="/api/authors" search-param="fullname"
                      search-field-placeholder="Rechercher un auteur"
                      :form-creation-validation-action="createAuthorFromForm" form-creation-title="Nouvel auteur"
                      v-on:entity-removed="authorRemoved" v-on:entity-added="authorAdded">

                <template v-slot:form_creation_body>
                    <InputText ref="authorFirstname" name="authorFirstname" label="Prénom"></InputText>
                    <InputText ref="authorLastname" name="authorLastname" label="Nom"></InputText>
                </template>

            </Entities>

            <InputText name="language" label="Langue" :value="cLanguage"
                       v-on:input-text-changed="propertyChanged"></InputText>
            <InputText name="year" label="Année" :value="cYear"
                       v-on:input-text-changed="propertyChanged"></InputText>
            <InputText name="pageCount" label="Nombre de pages" :value="cPageCount"
                       v-on:input-text-changed="propertyChanged"></InputText>
            <InputText name="isbn" label="Isbn" :value="cIsbn"
                       v-on:input-text-changed="propertyChanged"></InputText>

            <BooleanSwitch name="isElectronic" label="Livre électronique"></BooleanSwitch>

            <!--            <Files name="electronicBook" label="Livre"></Files>-->

        </template>
    </Group>
</template>

<script>
    import Group from "../../../../popup/Group";
    import InputText from "../../../../form/elements/InputText";
    import Entities from "../../../../form/elements/Entities";
    import BooleanSwitch from "../../../../form/elements/BooleanSwitch";
    import Files, {FileObject} from "../../../../form/elements/Files";

    import store from "../../../../../assets/js/store";
    import BookModule from "../../../../../assets/js/store/book";
    import AuthorModule from "../../../../../assets/js/store/author";

    if (!store.state['book']) {
        store.registerModule('book', BookModule);
    }

    if (!store.state['author']) {
        store.registerModule('author', AuthorModule);
    }

    export default {
        name: "GroupInformation",
        components: {BooleanSwitch, Entities, InputText, Group, Files},
        methods: {
            propertyChanged(field, value) {
                this.$store.commit('setProperty', {
                    propertyName: field,
                    value: value
                });
            },
            authorRemoved(author) {
                this.$store.commit('removeAuthor', author);
            },
            authorAdded(author) {
                this.$store.commit('addAuthor', author);
            },
            createAuthorFromForm() {
                this.$store.commit('author/setProperty', {
                    propertyName: 'firstname',
                    value: this.$refs.authorFirstname.getValue()
                });
                this.$store.commit('author/setProperty', {
                    propertyName: 'lastname',
                    value: this.$refs.authorLastname.getValue()
                });

                this.$store.dispatch('author/save')
                    .then(author => {
                        this.authorAdded(author);
                        this.$refs.authorFirstname.clear();
                        this.$refs.authorLastname.clear();
                    });
            }
        },
        computed: {
            cLanguage() {
                return this.$store.getters.getProperty('language');
            },
            cYear() {
                return this.$store.getters.getProperty('year');
            },
            cPageCount() {
                return this.$store.getters.getProperty('pageCount');
            },
            cIsbn() {
                return this.$store.getters.getProperty('isbn');
            },
            cAuthors() {
                return this.$store.getters.getProperty('authors')
            },
            cFiles() {
                // let file = this.$store.getters.getters('electronicBook');
                // return [
                //     new FileObject(file.)
                // ]
                return '';
            }
        },
        store
    }
</script>

<style scoped>

</style>