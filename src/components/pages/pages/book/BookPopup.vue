<template>
    <Popup id="bookPopup" :loaded="loaded">
        <template v-slot:popup_header>
            <InputText placeholder="Titre" name="title" v-model="title" custom-classes="input_title"
                       :no-label="true"></InputText>

            <TopButtonBar v-on:tab-button-clicked="setTab" v-on:popup-wanna-close="$emit('popup-wanna-close')"
                          :buttons="tabs" default-tab="main">
            </TopButtonBar>
        </template>

        <template v-slot:popup_body>
            <MainTab v-if="currentTab === 'main'" :book-store="bookStore"></MainTab>
            <SocialTab v-if="currentTab === 'social'"></SocialTab>
        </template>

        <template v-slot:popup_footer>
            <InputButton name="save" value="Enregistrer" type="submit" v-on:click.native="save"
                         v-if="isModified"></InputButton>
        </template>

    </Popup>
</template>

<script>
    import BookService from "../../../../assets/ts/service/BookService";

    const config = require('../../../../../mediatheque');

    import {getModule} from "vuex-module-decorators";

    import Popup from '../../../popup/Popup';
    import TopButtonBar, {TopButtonBarElement} from "../../../popup/TopButtonBar";
    import InputText from '../../../form/elements/InputText';
    import InputButton from '../../../form/elements/InputButton';

    // import {mapActions} from 'vuex';
    // import store from '../../../../assets/js/store';
    // import BookModule from '../../../../assets/js/store/book';
    //
    // if (!store.state['book']) {
    //     store.registerModule('book', BookModule);
    // }

    import bookElectronicModule from "../../../../assets/ts/store/book/BookElectronicModule";
    import bookPaperModule from "../../../../assets/ts/store/book/BookPaperModule";

    export default {
        name: "BookPopup",
        components: {
            MainTab: () => import('./bookPopup/MainTab'),
            SocialTab: () => import('./bookPopup/SocialTab'),
            InputButton, InputText, Popup, TopButtonBar
        },
        props: {
            bookId: {default: null},
            bookType: {type: String, default: BookService.bookPaper}
        },
        data() {
            return {
                loaded: false,
                currentTab: 'main',
                bookModule: undefined,
                bookStore: undefined
            }
        },
        methods: {
            save() {
                this.$store.dispatch('book/saveBook')
                    .then(() => {
                        this.$toasted.show('Le livre a été sauvegardé', {
                            ...config.default.notification_settings,
                            type: 'success',
                            icon: 'fa-check',
                        });
                        this.$emit('book-saved');
                    })
                    .catch(error => {
                        console.error(error);
                        alert("Une erreur s'est produite et le livre n'a pas pu être sauvegardé");
                    })
            },
            setTab(newTab) {
                this.currentTab = newTab;
            },
            reloadBook(bookId) {
                this.checkStore();
                this.loaded = false;

                if (typeof bookId === 'undefined') bookId = this.bookId;
                if (bookId) {
                    this.bookStore.get(bookId).then(() => {
                        this.loaded = true;
                    });
                } else {
                    this.$store.commit('book/unload');
                    this.loaded = true;
                }
            },
            checkStore() {
                //Change the store according to the book type
                if (typeof this.bookType !== 'string' ||
                    (this.bookType !== BookService.bookPaper && this.bookType !== BookService.bookElectronic))
                    throw "Invalid book type provided";

                this.bookStore = this.bookType === BookService.bookPaper ? bookPaperModule : bookElectronicModule;
                console.log(this.bookStore);
            }
        },
        computed: {
            title: {
                get() {
                    return this.bookStore.book.title;
                },
                set(title) {
                    this.bookStore.setTitle(title);
                }
            },
            id() {
                return this.bookStore.book.id;
            },
            isModified() {
                return this.bookStore.flagService.flags.isModified;
            },
            tabs() {
                let tabs = [
                    new TopButtonBarElement('fas fa-book', 'main')
                ];

                let isSocialActive = (typeof this.id !== 'undefined' && this.id.toString().length > 0);
                tabs.push(new TopButtonBarElement('fas fa-comment', 'social', isSocialActive));

                return tabs;
            }
        },
        watch: {
            bookId(newValue) {
                this.reloadBook(newValue);
            },
            bookType(bookType) {
                this.checkStore();
            }
        },
        created() {
            this.reloadBook();
        },
        // store
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
