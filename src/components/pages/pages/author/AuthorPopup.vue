<template>
    <Popup id="authorPopup">
        <template v-slot:popup_header>
            <div class="header_separator"></div>
            <InputButton v-on:click.native="$emit('popup-wanna-close')"
                         :label-custom-classes="'fas fa-times'" :custom-classes="['button_close']"></InputButton>
        </template>

        <template v-slot:popup_body>
            <Group>
                <template v-slot:group_name>
                    Informations
                </template>

                <template v-slot:group_content>
                    <InputText name="firstname" label="Prénom" :value="cFirstname"
                               v-on:input-text-changed="propertyChanged"></InputText>
                    <InputText name="lastname" label="Nom" :value="cLastname"
                               v-on:input-text-changed="propertyChanged"></InputText>
                </template>
            </Group>
        </template>

        <template v-slot:popup_footer>
            <InputButton name="save" value="Enregistrer" type="submit" v-on:click.native="save"
                         v-if="cIsModified"></InputButton>
        </template>

    </Popup>
</template>

<script>
    import Popup from "../../../popup/Popup";
    import InputText from '../../../form/elements/InputText';
    import InputButton from '../../../form/elements/InputButton';
    import Group from "../../../popup/Group";

    import {mapActions} from 'vuex';
    import store from '../../../../assets/js/store';
    import AuthorModule from '../../../../assets/js/store/author';

    if (!store.state['author']) {
        store.registerModule('author', AuthorModule);
    }

    export default {
        name: "AuthorPopup",
        components: {Group, Popup, InputText, InputButton},
        props: {
            authorId: {default: null}
        },
        methods: {
            ...mapActions({
                loadAuthor: 'author/load'
            }),
            propertyChanged(field, value) {
                this.$store.commit('author/setProperty', {
                    propertyName: field,
                    value: value
                });
            },
            save() {
                this.$store.dispatch('author/save')
                    .catch(error => {
                        console.error(error);
                        alert("Une erreur s'est produite et l'auteur n'a pas pu être sauvegardé");
                    })
            },
        },
        computed: {
            cFirstname() {
                return this.$store.getters['author/getProperty']('firstname');
            },
            cLastname() {
                return this.$store.getters['author/getProperty']('lastname');
            },
            cIsModified() {
                return this.$store.getters['author/getFlag']('isModified');
            }
        },
        watch: {
            authorId(newAuthorId) {
                if (newAuthorId) {
                    this.loadAuthor(newAuthorId);
                }
            }
        },
        created() {
            if (this.authorId) {
                this.loadAuthor(this.authorId);
            }
        }
    }
</script>

<style lang="scss">
    #authorPopup {
        .header_separator {
            flex: 1;
        }

        .button_close {
            width: 4rem;
            margin: 0;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: center;

            label {
                font-size: 2rem;
            }
        }
    }
</style>