<template>
    <FormElement :label="label" :name="name" container-custom-classes="form_element_entities"
                 label-custom-classes="entities_label">

        <template v-slot:element_content>
            <div v-for="(entity, index) in entities" :key="entity.id" class="entity">
                <div class="entity_label">{{getEntityLabel(entity)}}</div>
                <div class="entity_delete fas fa-times" v-on:click="removeEntity(index)"></div>
            </div>

            <div class="search_container">
                <div class="search_inputs">
                    <InputText name="searchValue" :no-label="true" :placeholder="searchFieldPlaceholder"
                               v-on:input-text-keyup="searchEntity"></InputText>
                    <InputButton name="searchCreate" label-custom-classes="fas fa-plus"
                                 :custom-classes="['btnSearchCreate']"
                                 v-if="isCreationAvailable"
                                 v-on:click.native="isFormCreationDisplayed = true"></InputButton>
                </div>

                <div class="search_results" v-if="isProposalsDisplayed">
                    <ul>
                        <li v-for="(proposal) in proposals" :key="proposal.id" v-on:click="addEntity(proposal)">
                            {{getEntityLabel(proposal)}}
                        </li>
                    </ul>
                    <div class="count_results">
                        {{countProposals}} résultat(s)
                    </div>
                </div>
            </div>

            <div class="creation_container" v-if="isFormCreationDisplayed">
                <FormContainer :validate-action="formCreationSubmited" :cancel-action="closeFormCreation">
                    <template v-slot:form_title>
                        {{formCreationTitle}}
                    </template>
                    <template v-slot:form_body>
                        <slot name="form_creation_body"></slot>
                    </template>
                </FormContainer>
            </div>

        </template>

    </FormElement>
</template>

<script>
    import FormElement from "../FormElement";
    import Xhr from '../../../assets/js/xhr';
    import Vue from 'vue';
    import InputText from "./InputText";
    import FormContainer from "../FormContainer";
    import InputButton from "./InputButton";

    export default {
        name: "Entities",
        components: {InputButton, FormContainer, InputText, FormElement},
        props: {
            entities: {default: () => [], type: Array},
            entityFields: {default: () => [], type: Array},
            searchParam: {type: String},
            fieldsSeparator: {default: ' ', type: String},
            entityURI: {type: String},
            label: {default: '', type: String},
            name: {default: '', type: String},
            searchFieldPlaceholder: {default: 'Rechercher une entité', type: String},
            formCreationValidationAction: {default: null},
            formCreationTitle: {default: ''}
        },
        data() {
            return {
                proposals: {},
                isProposalsDisplayed: false,
                isFormCreationDisplayed: false
            }
        },
        computed: {
            countProposals() {
                return Object.keys(this.proposals).length;
            },
            isCreationAvailable() {
                return (typeof this.formCreationValidationAction === 'function');
            }
        },
        methods: {
            getEntityLabel(entity) {
                let elements = [];
                this.entityFields.forEach((field) => {
                    if (entity[field]) {
                        elements.push(entity[field]);
                    }
                });
                return elements.join(this.fieldsSeparator);
            },
            removeEntity(indexInArray) {
                this.$emit('entity-removed', this.entities[indexInArray]);
                // Vue.delete(this.entities, indexInArray);
            },
            searchEntity(inputName, search) {
                if (search.length > 2) {

                    let data = {};
                    data[this.searchParam] = search;

                    Xhr.buildGetUrl(this.entityURI, data)
                        .then(url => {
                            return Xhr.fetch(url, {
                                method: 'GET'
                            });
                        })
                        .then(response => {
                            this.proposals = {};
                            response['hydra:member'].forEach(entity => {
                                Vue.set(this.proposals, entity.id, entity);
                            });
                            this.isProposalsDisplayed = true;
                        })
                        .catch(() => {
                            alert('Une erreur est survenue');
                        });
                }
            },
            addEntity(entity) {
                // this.entities.push(entity);
                this.isProposalsDisplayed = false;
                this.$emit('entity-added', entity);
            },
            formCreationSubmited() {
                if (typeof this.formCreationValidationAction === 'function') {
                    this.formCreationValidationAction();
                }
                this.isFormCreationDisplayed = false;
            },
            closeFormCreation() {
                this.isFormCreationDisplayed = false;
            }
        }
    }
</script>

<style lang="scss">

    @import "../../../assets/scss/colors";


    .entities_label {
        line-height: 2rem;
    }

    .entity {
        display: inline-flex;
        border: 1px solid transparent;
        border-radius: 10px;
        padding: 1px 1px 1px 3px;
        transition: all .3s;

        .entity_delete {
            font-size: .8rem;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            margin-top: -1px;
            margin-left: 2px;
            visibility: hidden;
            opacity: 0;
            transition: all .3s;
        }

        &:hover {
            .entity_delete {
                visibility: visible;
                opacity: 1;
            }

            border-color: $shade1;
        }
    }

    .search_container {
        position: relative;

        .form_element_text {
            margin: 3px 0 0 0;
        }

        .search_inputs {
            display: flex;

            .btnSearchCreate {
                height: calc(2rem - 5px);
                padding: 0 4px;
                margin: 5px 0 0 0;

                label {
                    line-height: calc(2rem - 5px);
                }
            }
        }

        .search_results {
            position: absolute;
            background-color: $shade3;
            border: 1px solid $shade1;
            width: calc(100% - 5px);

            ul {
                list-style-type: none;
                margin: 0;
                padding: 0;

                li {
                    padding: 5px;
                }

                li:hover {
                    background-color: $shade1;
                }
            }

            .count_results {
                font-size: .8rem;
                font-style: italic;
                text-align: right;
                margin: 3px;
            }
        }
    }

    .creation_container {
        position: absolute;
        background-color: white;
        box-shadow: 1px 1px 5px $shade1;
        padding: 2px;
    }
</style>