<template>
    <Popup id="bookPopup">
        <template v-slot:popup_header>
            <InputText :placeholder="'Titre'" :name="'title'" :value="title" :custom-classes="'input_title'"
                       :no-label="true" v-on:input-text-changed="dataChanged"></InputText>
            <InputButton v-on:click.native="$emit('popup-wanna-close')"
                         :label-custom-classes="'fas fa-times'" :custom-classes="['button_close']"></InputButton>
        </template>

        <template v-slot:popup_body>
            <GroupPicture class="groupPicture"></GroupPicture>
            <div class="bookPopupColumn">
                <GroupSummary class="groupSummary"></GroupSummary>
                <GroupReferences></GroupReferences>
            </div>
            <GroupInformation class="groupInformation"></GroupInformation>
        </template>

        <template v-slot:popup_footer>
            <InputButton :name="'save'" :value="'Enregistrer'" :type="'submit'" v-on:click.native="save"
                         v-if="isModified"></InputButton>
        </template>

    </Popup>
</template>

<script>
    import Popup from '../../../popup/Popup';
    import InputText from '../../../form/elements/InputText';
    import InputButton from '../../../form/elements/InputButton';

    import GroupInformation from "./bookPopup/GroupInformation";
    import GroupPicture from "./bookPopup/GroupPicture";
    import GroupSummary from "./bookPopup/GroupSummary";
    import GroupReferences from "./bookPopup/GroupReferences";

    import {mapActions} from 'vuex';
    import store from '../../../../assets/js/store';
    import BookModule from '../../../../assets/js/store/book';

    if (!store.state['book']) {
        store.registerModule('book', BookModule);
    }

    export default {
        name: "BookPopup",
        components: {GroupReferences, GroupSummary, GroupPicture, GroupInformation, InputButton, InputText, Popup},
        props: {
            bookId: {default: null}
        },
        methods: {
            dataChanged(name, value) {
                this.$store.commit('setProperty', {propertyName: name, value: value});
            },
            save() {
                this.$store.dispatch('saveBook')
                    .catch(error => {
                        console.error(error);
                        alert("Une erreur s'est produite et le livre n'a pas pu être sauvegardé");
                    })
            },
            ...mapActions([
                'loadBook'
            ])
        },
        computed: {
            title() {
                return this.$store.getters.getProperty('title');
            },
            isModified() {
                return this.$store.getters.getFlag('isModified');
            }
        },
        watch: {
            bookId(newValue) {
                if (newValue) {
                    this.loadBook(newValue);
                }
            }
        },
        created() {
            if (this.bookId) {
                this.loadBook(this.bookId);
            }
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

        .button_close {
            width: 4rem;
            margin: 0px;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: center;

            label {
                font-size: 2rem;
            }
        }

        .groupPicture {
            width: 10%;
            min-width: 150px;
        }

        .groupSummary {
            height: 50%;
        }

        .groupInformation {
            min-width: 450px;
            width: 50%;
        }

        .bookPopupColumn{
            flex: 1;
        }
    }
</style>