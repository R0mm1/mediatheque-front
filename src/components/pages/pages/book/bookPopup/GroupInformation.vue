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

            <BooleanSwitch name="isElectronic" label="Livre électronique" :value="cIsElectronic"
                           v-on:boolean-switch-state-changed="setBookType"></BooleanSwitch>

            <Select name="owner" label="Propriétaire" :options-source="getUserListPromise" :value="cOwner"
                    v-if="!cIsElectronic" v-on:select-changed="setOwner"></Select>

            <Files name="electronicBook" label="Livre" :max-files="Number(1)" :on-file-added="setElectronicBook"
                   :on-file-removed="removeElectronicBook" :files="cElectronicFile" :download-action="downloadEbook"
                   v-if="cIsElectronic"></Files>

        </template>
    </Group>
</template>

<script>
    import Group from "../../../../popup/Group";
    import InputText from "../../../../form/elements/InputText";
    import Entities from "../../../../form/elements/Entities";
    import BooleanSwitch from "../../../../form/elements/BooleanSwitch";
    import Files from "../../../../form/elements/Files";
    import Xhr from "../../../../../assets/js/xhr";

    import store from "../../../../../assets/js/store";
    import BookModule from "../../../../../assets/js/store/book";
    import AuthorModule from "../../../../../assets/js/store/author";
    import Select from "../../../../form/elements/Select";

    if (!store.state['book']) {
        store.registerModule('book', BookModule);
    }

    if (!store.state['author']) {
        store.registerModule('author', AuthorModule);
    }

    export default {
        name: "GroupInformation",
        components: {Select, BooleanSwitch, Entities, InputText, Group, Files},
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
            },
            setElectronicBook(file) {
                this.$store.commit('setProperty', {
                    propertyName: 'electronicBook',
                    value: file
                });
            },
            removeElectronicBook() {
                this.$store.commit('deleteRelatedEbook');
            },
            setOwner(userId) {
                this.$store.commit('setOwner', userId);
            },
            getUserListPromise() {
                return Xhr.buildGetUrl('/api/users')
                    .then(url => {
                        return Xhr.fetch(url, {});
                    })
                    .then(response => {
                        let users = {};
                        response['hydra:member'].forEach(user => {
                            users[user.id] = user.username;
                        });
                        return Promise.resolve(users);
                    })
            },
            setBookType(field, isElectronic) {
                this.$store.commit('setFlag', {
                    flagName: 'isElectronic',
                    value: isElectronic
                });
            },
            downloadEbook() {
                this.$store.dispatch('downloadEbook');
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
            cIsElectronic() {
                return this.$store.getters.getFlag('isElectronic');
            },
            cElectronicFile() {
                let filesArray = [];
                let file = this.$store.getters.getProperty('electronicBook');
                if (file) {
                    filesArray.push(file);
                }
                return filesArray;
            },
            cOwner() {
                let owner = this.$store.getters.getProperty('owner');

                if (typeof owner === 'object' && typeof owner.id !== 'undefined') {
                    return owner.id;
                }
                return null;
            }
        },
        store
    }
</script>

<style scoped>

</style>