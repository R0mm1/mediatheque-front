<template>
    <Group>
        <template v-slot:group_name>
            Groupes
        </template>

        <template slot="group_customActions">
            <InputButton label-custom-classes="fas fa-plus-circle" v-on:click.native="toggleDisplayFormData">
            </InputButton>
        </template>

        <template v-slot:group_content>
            <Accordion v-if="!groupFormDisplayed" :blocs="blocs">
                <SimpleList v-for="bloc in blocs" :slot="bloc.slotId" :key="bloc.slotId"
                            :elements="blocsRows[bloc.slotId]"></SimpleList>
            </Accordion>

            <div v-if="groupFormDisplayed" class="group_manage">
                <FormContainer :validate-action="validateGroupLinking">
                    <template v-slot:form_title>Ajouter à un groupe existant</template>
                    <template v-slot:form_body>
                        <Select ref="selectExistingGroups" :options-source="getExistingGroupsPromise"
                                label="Groupes"></Select>
                    </template>
                    <template v-slot:action_cancel><span></span></template>
                </FormContainer>

                <FormContainer validateLabel="Enregistrer" :validateAction="validateGroupCreation"
                               :cancelAction="toggleDisplayFormData">
                    <template v-slot:form_title>Créer un nouveau groupe</template>
                    <template v-slot:form_body>
                        <InputText ref="newGroupComment" label="Commentaire"></InputText>
                    </template>
                </FormContainer>
            </div>

        </template>
    </Group>
</template>

<script>
    import Group from "../../../../../popup/Group";
    import InputButton from "../../../../../form/elements/InputButton";
    import Accordion, {AccordionBloc} from "../../../../../widgets/Accordion";
    import SimpleList, {Element} from "../../../../../widgets/SimpleList";

    import Xhr from "../../../../../../assets/js/xhr";

    import store from "../../../../../../assets/js/store";
    import BookModule from "../../../../../../assets/js/store/book";
    import FormContainer from "../../../../../form/FormContainer";
    import InputText from "../../../../../form/elements/InputText";
    import Select from "../../../../../form/elements/Select";

    if (!store.state['book']) {
        store.registerModule('book', BookModule);
    }

    export default {
        name: "GroupReferences",
        components: {Select, InputText, FormContainer, SimpleList, Accordion, InputButton, Group},
        props: {
            bookId: {default: null}
        },
        data() {
            return {
                blocs: [],
                blocsRows: {},
                groupFormDisplayed: false,
                cacheGroupList: {}
            }
        },
        computed: {
            cBookId() {
                return this.$store.getters['book/getProperty']('id');
            }
        },
        methods: {
            toggleDisplayFormData() {
                this.groupFormDisplayed = !this.groupFormDisplayed;
            },
            validateGroupCreation() {
                Xhr.buildGetUrl('/api/reference_groups')
                    .then(url => {
                        return Xhr.fetch(url, {
                            method: 'POST',
                            headers: new Headers({
                                "Content-Type": "application/json"
                            }),
                            body: JSON.stringify({
                                'comment': this.$refs.newGroupComment.getValue(),
                                'books': [
                                    '/api/books/' + this.cBookId
                                ]
                            })
                        });
                    })
                    .then(() => {
                        this.loadGroups();
                        this.groupFormDisplayed = false;
                    })
                    .catch(error => {
                        console.error(error);
                        alert("Une erreur c'est produite et le groupe n'a pas été créé");
                    });
            },
            validateGroupLinking() {
                let groupId = this.$refs.selectExistingGroups.getValue();

                let aBookLinked = this.cacheGroupList[groupId]['books'];
                aBookLinked.push('/api/books/' + this.cBookId);

                Xhr.buildGetUrl('/api/reference_groups/' + groupId)
                    .then(url => {
                        return Xhr.fetch(url, {
                            method: 'PUT',
                            headers: new Headers({
                                "Content-Type": "application/json"
                            }),
                            body: JSON.stringify({
                                'books': aBookLinked
                            })
                        });
                    })
                    .then(() => {
                        this.loadGroups();
                        this.groupFormDisplayed = false;
                    })
                    .catch(error => {
                        console.error(error);
                        alert("Une erreur c'est produite et le livre n'a pas été ajouté au groupe");
                    });
            },
            loadGroups() {
                if (this.cBookId.length === 0) return;

                Xhr.buildGetUrl('/api/reference_groups', {'books.id': this.cBookId})
                    .then(url => {
                        return Xhr.fetch(url, {
                            method: 'GET'
                        });
                    })
                    .then(data => {
                        let blocs = [];
                        data['hydra:member'].forEach(referenceGroup => {
                            //Creating the bloc for the accordion
                            blocs.push(new AccordionBloc(referenceGroup.comment, referenceGroup.id));

                            //Get the list of the books title's to display for this reference group
                            let blocRows = [];
                            Object.keys(referenceGroup.books).forEach(index => {
                                let book = referenceGroup.books[index];
                                let listElement = new Element(book.id, book.title);
                                blocRows.push(listElement);
                            });
                            this.$set(this.blocsRows, referenceGroup.id, blocRows);
                        });
                        this.blocs = blocs;
                    })
                    .catch(error => {
                        console.error(error);
                        alert('Une erreur est survenue pendant la récupération des groupes de références');
                    });
            },
            getExistingGroupsPromise() {
                return Xhr.buildGetUrl('/api/reference_groups', {'order': {'comment': 'DESC'}})
                    .then(url => {
                        return Xhr.fetch(url, {
                            method: 'GET'
                        })
                    })
                    .then(data => {
                        let groups = {};
                        if (data['hydra:member']) {
                            data['hydra:member'].forEach(group => {
                                this.cacheGroupList[group.id] = group;
                                groups[group.id] = group.comment;
                            });
                            return Promise.resolve(groups);
                        } else {
                            return Promise.reject(new Error("La requête a retourné une réponse invalide"));
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        alert(error);
                    });
            }
        },
        watch: {
            cBookId() {
                this.loadGroups();
            }
        },
        store
    }
</script>
