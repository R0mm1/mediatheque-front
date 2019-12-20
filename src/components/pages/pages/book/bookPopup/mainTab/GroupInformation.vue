<template>
    <Group>
        <template v-slot:group_name>
            Informations
        </template>
        <template v-slot:group_content>
            <Entities name="authors" label="Auteurs" :entities="authors" :entity-fields="['firstname', 'lastname']"
                      entity-u-r-i="/api/authors" search-param="fullname"
                      search-field-placeholder="Rechercher un auteur"
                      :form-creation-validation-action="createAuthorFromForm" form-creation-title="Nouvel auteur"
                      v-on:entity-removed="authorRemoved" v-on:entity-added="authorAdded">

                <template v-slot:form_creation_body>
                    <InputText v-model="newAuthor.firstname" name="authorFirstname" label="Prénom"/>
                    <InputText v-model="newAuthor.lastname" name="authorLastname" label="Nom"/>
                </template>

            </Entities>

            <InputText name="language" label="Langue" v-model="language"/>
            <InputText name="year" label="Année" v-model="year"/>

            <InputText name="pageCount" label="Nombre de pages" v-model="pageCount"/>
            <InputText name="isbn" label="Isbn" v-model="isbn"/>

            <Select name="owner" label="Propriétaire" :options-source="getUserListPromise" :value="ownerId"
                    v-if="!isElectronic" v-on:select-changed="setOwner"/>

            <Files name="electronicBook" label="Livre" :max-files="Number(1)" :on-file-added="setElectronicBook"
                   :on-file-removed="removeElectronicBook" :files="cElectronicFile" :download-action="downloadEbook"
                   v-if="isElectronic"/>

        </template>
    </Group>
</template>

<script>
    import Group from "../../../../../popup/Group";
    import InputText from "../../../../../form/elements/InputText";
    import Entities from "../../../../../form/elements/Entities";
    import Files from "../../../../../form/elements/Files";
    import Xhr from "../../../../../../assets/js/xhr";

    import Select from "../../../../../form/elements/Select";
    import BookService from "../../../../../../assets/ts/service/BookService";
    import MedFile from "../../../../../../assets/js/medFile";

    import authorModule from "../../../../../../assets/ts/store/AuthorModule"

    export default {
        name: "GroupInformation",
        components: {Select, Entities, InputText, Group, Files},
        props: {bookStore: {type: Object, required: true}},
        data() {
            return {
                newAuthor: {
                    firstname: undefined,
                    lastname: undefined
                }
            }
        },
        methods: {
            authorRemoved(author) {
                this.bookStore.removeAuthor(author);
            },
            authorAdded(author) {
                this.bookStore.addAuthor(author);
            },
            createAuthorFromForm() {
                authorModule.new();
                authorModule.setFirstname(this.newAuthor.firstname);
                authorModule.setLastname(this.newAuthor.lastname);
                authorModule.save().then(author => {
                    this.authorAdded(author);
                    this.newAuthor.firstname = undefined;
                    this.newAuthor.lastname = undefined;
                });
            },
            setElectronicBook(file) {
                this.bookStore.linkNewFile(file);
            },
            removeElectronicBook() {
                this.bookStore.unlinkBookFile();
            },
            setOwner(userId) {
                this.bookStore.setOwner(parseInt(userId));
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
                this.$parent.$parent.$emit('book-type-changed', isElectronic);
            },
            downloadEbook() {
                this.bookStore.downloadEbook();
            }
        },
        computed: {
            language: {
                get() {
                    return this.bookStore.book.language;
                },
                set(language) {
                    this.bookStore.setLanguage(language);
                }
            },
            year: {
                get() {
                    return this.bookStore.book.year;
                },
                set(year) {
                    this.bookStore.setYear(year);
                }
            },
            pageCount: {
                get() {
                    return this.bookStore.book.pageCount;
                },
                set(pageCount) {
                    this.bookStore.setPageCount(pageCount);
                }
            },
            isbn: {
                get() {
                    return this.bookStore.book.isbn;
                },
                set(isbn) {
                    this.bookStore.setIsbn(isbn);
                }
            },
            isElectronic() {
                return this.bookStore.book['@type'] === BookService.bookElectronic;
            },
            authors() {
                return this.bookStore.book.authors;
            },
            cElectronicFile() {
                let filesArray = [];

                if (typeof this.bookStore.book.bookFile === 'object' && this.bookStore.book.bookFile !== null) {
                    filesArray.push(new MedFile(
                        this.bookStore.book.bookFile.path,
                        this.bookStore.book.bookFile.path,
                        this.bookStore.book.bookFile.id,
                        false
                    ));
                }

                return filesArray;
            },
            ownerId() {
                const owner = this.bookStore.book.owner;

                if (owner === null) {
                    return null;
                } else if (typeof owner === 'string') {
                    return owner.split('/').pop().split('=').pop();
                } else if (typeof owner === 'object') {
                    return owner.id;
                }
                return null;
            }
        }
    }
</script>

<style scoped>

</style>
