<template>
    <Page name="account">
        <template v-slot:med_page_body>
            <FormContainer validate-label="Modifier" :validate-action="save" :validation-method="isValid">
                <template v-slot:form_title>
                    Modifier le mot de passe
                </template>

                <template v-slot:form_body v-if="!cIsLoading">
                    <Loader v-if="cIsLoading"></Loader>

                    <template v-if="!cIsLoading">
                        <InputPassword name="passwd" label="Mot de passe"
                                       v-on:input-password-changed="setValue"></InputPassword>
                        <InputPassword name="passwdRepeat" label="Répéter"
                                       v-on:input-password-changed="setValue"></InputPassword>
                    </template>
                </template>

                <template v-slot:action_cancel><span></span></template>
            </FormContainer>
        </template>
    </Page>
</template>

<script>
    import Page from "../Page";
    import FormContainer from "../../form/FormContainer";
    import InputPassword from "../../form/elements/InputPassword";
    import Loader from "../../widgets/Loader";

    import store from '../../../assets/js/store';
    import LoggedInModule from '../../../assets/js/store/user/loggedIn';

    if (!store.state['loggedIn']) {
        store.registerModule('loggedIn', LoggedInModule);
    }

    export default {
        name: "Account",
        components: {Loader, InputPassword, FormContainer, Page},
        data() {
            return {
                passwd: null,
                passwdRepeat: null,
                hasError: true
            }
        },
        methods: {
            checkPasswd() {
                this.hasError = this.passwdRepeat !== null && this.passwd !== this.passwdRepeat;
            },
            setValue(inputName, value) {
                this[inputName] = value;
            },
            isValid() {
                return this.passwdRepeat !== null && !this.hasError;
            },
            save() {
                this.$store.dispatch('loggedIn/setPassword', this.passwd);
            }
        },
        computed: {
            cUserId() {
                return this.$store.getters['loggedIn/getProperty']('id')
            },
            cIsLoading() {
                return this.cUserId.toString().length === 0;
            }
        },
        watch: {
            passwd(newVal) {
                this.passwd = newVal;
                this.checkPasswd();
            },
            passwdRepeat(newVal) {
                this.passwdRepeat = newVal;
                this.checkPasswd();
            }
        },
        created() {
            this.$store.dispatch('loggedIn/load');
        },
        store
    }
</script>

<style lang="scss">
    @import "../../../assets/scss/colors";

    #med_page.account {
        .med_form {
            background: $shade3;
            width: 25%;
            min-width: 500px;
            margin: 5px;

            form {
                padding: 5px;
            }
        }
    }
</style>