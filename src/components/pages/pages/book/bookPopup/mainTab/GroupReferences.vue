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
                            :elements="blocsRows[bloc.slotId]"/>
            </Accordion>

            <div v-if="groupFormDisplayed" class="group_manage">
                <FormContainer :validate-action="validateGroupLinking">
                    <template v-slot:form_title>Ajouter à un groupe existant</template>
                    <template v-slot:form_body>
                        <Select ref="selectExistingGroups" :options-source="getExistingGroupsPromise"
                                label="Groupes"/>
                    </template>
                    <template v-slot:action_cancel><span></span></template>
                </FormContainer>

                <FormContainer validateLabel="Enregistrer" :validateAction="validateGroupCreation"
                               :cancelAction="toggleDisplayFormData">
                    <template v-slot:form_title>Créer un nouveau groupe</template>
                    <template v-slot:form_body>
                        <InputText v-model="newGroupComment" label="Commentaire"/>
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

    import FormContainer from "../../../../../form/FormContainer";
    import InputText from "../../../../../form/elements/InputText";
    import Select from "../../../../../form/elements/Select";

    import groupModule from "../../../../../../assets/ts/store/GroupModule";

    import EventService from "../../../../../../assets/ts/service/EventService";
    import {BookModule} from "../../../../../../assets/ts/store/book/BookModule";

    const eventService = EventService.getService();

    export default {
        name: "GroupReferences",
        components: {Select, InputText, FormContainer, SimpleList, Accordion, InputButton, Group},
        props: {
            bookStore: {required: true}
        },
        data() {
            return {
                blocs: [],
                blocsRows: {},
                groupFormDisplayed: false,
                cacheGroupList: {},
                relatedGroups: []
            }
        },
        computed: {
            bookId() {
                return this.bookStore.book.id;
            },
            newGroupComment: {
                get() {
                    return groupModule.group.comment;
                },
                set(comment) {
                    return groupModule.setComment(comment);
                }
            }
        },
        methods: {
            toggleDisplayFormData() {
                this.groupFormDisplayed = !this.groupFormDisplayed;
            },
            validateGroupCreation() {
                groupModule.save()
                    .then(group => {
                        //Add the group on the list widget
                        this.blocs.push(new AccordionBloc(group.comment, group.id));
                        this.$set(this.blocsRows, group.id, [
                            new Element(this.bookStore.book.id, this.bookStore.book.title)
                        ]);

                        //Add the group on the list of groups to be linked to the book on saving
                        this.relatedGroups.push(group);

                        //Re-init the groupModule to clear the form
                        groupModule.init();

                        //Hide the popup
                        this.groupFormDisplayed = false;
                    })
                    .catch(error => {
                        console.error(error);
                        alert("Une erreur c'est produite et le groupe n'a pas été créé");
                    });
            },
            validateGroupLinking() {
                const groupId = this.$refs.selectExistingGroups.getValue();
                const group = this.cacheGroupList[groupId];

                //Add the group on the list widget
                this.blocs.push(new AccordionBloc(group.comment, group.id));
                const rows = group.books.map(book => {
                    return new Element(book.id, book.title);
                });
                rows.push(new Element(this.bookStore.book.id, this.bookStore.book.title));
                this.$set(this.blocsRows, group.id, rows);


                //Add the group on the list of groups to be linked to the book on saving
                this.relatedGroups.push(group);

                //Hide the popup
                this.groupFormDisplayed = false;
            },
            loadGroups() {
                if (typeof this.bookId === 'undefined') return;

                groupModule.list({'books.id': this.bookId})
                    .then(data => {
                        let blocs = [];
                        data['hydra:member'].forEach(referenceGroup => {
                            //Creating the bloc for the accordion
                            blocs.push(new AccordionBloc(referenceGroup.comment, referenceGroup.id));

                            //Get the list of the books title's to display for this reference group
                            const blocRows = referenceGroup.books.map(book => {
                                return new Element(book.id, book.title);
                            });
                            this.$set(this.blocsRows, referenceGroup.id, blocRows);
                        });

    // import {mapActions} from 'vuex';
    // import store from '../../../../assets/js/store';
    // import BookModule from '../../../../assets/js/store/book';
    //
    // if (!store.state['book']) {
    //     store.registerModule('book', BookModule);
    // }
                        this.blocs = blocs;
                    })
                    .catch(error => {
                        console.error(error);
                        alert('Une erreur est survenue pendant la récupération des groupes de références');
                    });
            },
            getExistingGroupsPromise() {
                return groupModule.list({'order': {'comment': 'DESC'}})
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
            bookId() {
                this.loadGroups();
            }
        },
        created() {
            eventService.on(BookModule.EVENT_BOOK_SAVED, () => {
                this.relatedGroups.forEach(group => {
                    let bookLinked = group.books.reduce((accu, book) => {
                        return accu || book['@id'] === this.bookStore.book['@id'];
                    }, false);

                    if (!bookLinked) {
                        groupModule.set(group);
                        groupModule.addBook(this.bookStore.book['@id']);
                        this.bookStore.addReferenceGroupSaving(groupModule.save());
                    }
                })
            });
            this.loadGroups();
        }
    }
</script>
