<template>
    <Popup id="bookPopup" :loaded="loaded">
        <template v-slot:popup_header>
            <InputText placeholder="Titre" name="title" :value="title" custom-classes="input_title"
                       :no-label="true" v-on:input-text-changed="dataChanged"></InputText>

            <TopButtonBar v-on:tab-button-clicked="setTab" v-on:popup-wanna-close="$emit('popup-wanna-close')"
                          :buttons="tabs" default-tab="main">
            </TopButtonBar>
        </template>

        <template v-slot:popup_body>
            <MainTab v-if="currentTab === 'main'"></MainTab>
            <SocialTab v-if="currentTab === 'social'"></SocialTab>
        </template>

        <template v-slot:popup_footer>
            <InputButton name="save" value="Enregistrer" type="submit" v-on:click.native="save"
                         v-if="isModified"></InputButton>
        </template>

    </Popup>
</template>

<script>
    const config = require('../../../../../mediatheque');

    import Popup from '../../../popup/Popup';
    import TopButtonBar, {TopButtonBarElement} from "../../../popup/TopButtonBar";
    import InputText from '../../../form/elements/InputText';
    import InputButton from '../../../form/elements/InputButton';

    import {mapActions} from 'vuex';
    import store from '../../../../assets/js/store';
    import BookModule from '../../../../assets/js/store/book';

    if (!store.state['book']) {
        store.registerModule('book', BookModule);
    }

    export default {
        name: "BookPopup",
        components: {
            MainTab: () => import('./bookPopup/MainTab'),
            SocialTab: () => import('./bookPopup/SocialTab'),
            InputButton, InputText, Popup, TopButtonBar
        },
        props: {
            bookId: {default: null}
        },
        data() {
            return {
                loaded: false,
                currentTab: 'main'
            }
        },
        methods: {
            dataChanged(name, value) {
                this.$store.commit('book/setProperty', {propertyName: name, value: value});
            },
            save() {
                this.$store.dispatch('book/saveBook')
                    .then(() => {
                        this.$toasted.show('Le livre a été sauvegardé', {
                            ...config.default.notification_settings,
                            type: 'success',
                            icon: 'fa-check',
                        });
                    })
                    .catch(error => {
                        console.error(error);
                        alert("Une erreur s'est produite et le livre n'a pas pu être sauvegardé");
                    })
            },
            setTab(newTab) {
                this.currentTab = newTab;
            },
            ...mapActions([
                'book/loadBook'
            ]),
            reloadBook(bookId) {
                this.loaded = false;

                if (typeof bookId === 'undefined') bookId = this.bookId;
                if (bookId) {
                    this['book/loadBook'](bookId)
                        .then(() => {
                            this.loaded = true;
                        });
                } else {
                    this.$store.commit('book/unload');
                    this.loaded = true;
                }
            }
        },
        computed: {
            title() {
                return this.$store.getters['book/getProperty']('title');
            },
            id() {
                return this.$store.getters['book/getProperty']('id');
            },
            isModified() {
                return this.$store.getters['book/getFlag']('isModified');
            },
            tabs() {
                let tabs = [
                    new TopButtonBarElement('fas fa-book', 'main')
                ];

                let isSocialActive = (this.id.toString().length > 0);
                tabs.push(new TopButtonBarElement('fas fa-comment', 'social', isSocialActive));

                return tabs;
            }
        },
        watch: {
            bookId(newValue) {
                this.reloadBook(newValue);
            }
        },
        created() {
            this.reloadBook();
        },
        store
    }
</script>

<style lang="scss">
    #bookPopup {
        .input_title {
            flex: 1;
            height: 100%;
            margin: 0;

            .element_content {
                height: 100% !important;
                margin: 0 !important;
            }

            input {
                font-size: 2.5rem;
            }
        }
    }
</style>
