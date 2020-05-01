<template>
    <FormElement :label="label" :name="name" container-custom-classes="form_element_entities"
                 label-custom-classes="entities_label">

        <template v-slot:element_content>
            <div v-for="(entity, index) in entities" :key="entity.id" class="entity">
                <div class="entity_label">{{getEntityLabel(entity)}}</div>
                <div class="entity_delete" v-on:click="removeEntity(index)">
                    <div class="fas fa-times"></div>
                </div>
            </div>

            <div class="search_container_placeholder">
                <div class="search_container" :class="{search_active: isProposalsDisplayed}">
                    <div class="search_inputs">
                        <InputText name="searchValue" :no-label="true" :placeholder="searchFieldPlaceholder"
                                   v-model="searchString"
                                   v-on:click.native="openProposalsList"></InputText>
                        <Button :button-descriptor="buttonAddDescriptor"
                                v-if="isCreationAvailable"
                                v-on:click.native="openFormCreation"></Button>
                    </div>

                    <div class="search_results" v-if="isProposalsDisplayed" v-click-outside="closeProposalsList">
                        <div v-if="searchString.length < 3 && !isFormCreationDisplayed" class="search_notice">
                            Entrez au moins trois caractères
                        </div>
                        <div v-if="searching === true" class="search_loading">
                            <Loader type="s"></Loader>
                        </div>

                        <div v-if="searchString.length >= 3 && searching === false">
                            <ul>
                                <li v-for="(proposal) in proposals" :key="proposal.id" v-on:click="addEntity(proposal)">
                                    {{getEntityLabel(proposal)}}
                                </li>
                            </ul>
                            <div class="count_results">
                                {{countProposals}} résultat(s)
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
                    </div>
                </div>
            </div>

        </template>

    </FormElement>
</template>

<script>
    import ClickOutside from 'vue-click-outside'

    import FormElement from "../FormElement";
    import Vue from 'vue';
    import InputText from "./InputText";
    import FormContainer from "../FormContainer";
    import {container} from 'tsyringe';
    import RequestService from "../../../assets/ts/service/RequestService";
    import Loader from "../../widgets/Loader";
    import ButtonDescriptor from "../../../assets/ts/form/ButtonDescriptor";
    import Button from "./Button";

    const requestService = container.resolve(RequestService);

    export default {
        name: "Entities",
        components: {Button, Loader, FormContainer, InputText, FormElement},
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
                isFormCreationDisplayed: false,
                searchString: '',
                searching: false
            }
        },
        computed: {
            countProposals() {
                return Object.keys(this.proposals).length;
            },
            isCreationAvailable() {
                return (typeof this.formCreationValidationAction === 'function');
            },
            buttonAddDescriptor() {
                const descriptor = new ButtonDescriptor('searchCreate');
                return descriptor
                    .setStyle('negative')
                    .setRoundedCorner(true)
                    .setFaIcon('fas fa-plus')
                    .addCustomClass('btnSearchCreate')
                    .setIsIconButon(true, 2, 'rem');
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
            },
            addEntity(entity) {
                this.closeProposalsList();
                this.searchString = '';
                this.$emit('entity-added', entity);
            },
            closeProposalsList() {
                this.isProposalsDisplayed = false;
                this.isFormCreationDisplayed = false;
            },
            openProposalsList() {
                this.isProposalsDisplayed = true;
            },
            formCreationSubmited() {
                if (typeof this.formCreationValidationAction === 'function') {
                    this.formCreationValidationAction();
                }
                this.closeFormCreation();
            },
            openFormCreation() {
                this.searchString = '';
                this.isProposalsDisplayed = true;
                this.isFormCreationDisplayed = true;
            },
            closeFormCreation() {
                this.isFormCreationDisplayed = false;
                this.isProposalsDisplayed = false;
            }
        },
        watch: {
            searchString(newVal) {
                if (newVal.length >= 3) {
                    this.isFormCreationDisplayed = false;
                    this.searching = true;
                    let data = {};
                    data[this.searchParam] = newVal;

                    const request = requestService.createRequest(this.entityURI)
                        .setQueryParams(data);

                    return requestService.execute(request)
                        .then(response => {
                            this.proposals = {};
                            response['hydra:member'].forEach(entity => {
                                Vue.set(this.proposals, entity.id, entity);
                            });
                            this.searching = false;
                        })
                        .catch(() => {
                            alert('Une erreur est survenue');
                            this.searching = false;
                        });
                }
            }
        },
        mounted() {
            this.popupItem = this.$el;
        },
        directives: {
            ClickOutside
        }
    }
</script>

<style lang="scss">

    @import "../../../assets/scss/colors";

    .form_element_entities {
        .element_content {
            position: relative;
        }

        .entities_label {
            line-height: 2rem;
        }

        .entity {
            display: inline-flex;
            margin-right: 2px;
            transition: all .3s;
            padding: 2px;

            .entity_delete {
                font-size: .9rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 1px 0 3px;
                opacity: 0;
                transition: all .3s;
            }

            &:hover {
                background-color: $shade2;

                .entity_delete {
                    opacity: 1;
                }
            }
        }

        .search_container_placeholder {
            height: 2rem;
        }

        .search_container {
            position: absolute;
            width: 100%;
            background-color: #f8f5ef;

            &.search_active {
                box-shadow: 0 0 15px 5px rgba(0, 0, 0, .1);
            }

            .form_element_text {
                margin: 3px 0 0 0;
            }

            .search_inputs {
                display: flex;

                .form_element_text {
                    flex: 1;
                }
            }

            .search_results {

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

            .search_notice {
                font-size: .9rem;
                text-align: center;
                margin: 5px 0px;
            }

            .search_loading {
                display: flex;
                justify-content: center;

                img {
                    width: 25px;
                    margin: 5px;
                }
            }
        }

        .creation_container {
            padding: 2px;
        }

    }

</style>
