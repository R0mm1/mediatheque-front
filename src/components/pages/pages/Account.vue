<template>
    <Page name="account">
        <template v-slot:med_page_body>
            <FormContainer validate-label="Modifier" :validate-action="save" :validation-method="isValid">
                <template v-slot:form_title>
                    Modifier le mot de passe
                </template>

                <template v-slot:form_body v-if="!isLoading">
                    <Loader v-if="isLoading"></Loader>

                    <template v-if="!isLoading">
                        <InputPassword name="passwd" label="Mot de passe" v-model="passwd"></InputPassword>
                        <InputPassword name="passwdRepeat" label="Répéter" v-model="passwdRepeat"></InputPassword>
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

    import userModule from '../../../assets/ts/store/user/UserModule';

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
            isValid() {
                return this.passwdRepeat !== null && !this.hasError;
            },
            save() {
                userModule.setPassword(this.passwd);
            }
        },
        computed: {
            userId() {
                return userModule.user.id;
            },
            isLoading() {
                return typeof this.userId !== 'undefined' && this.userId.toString().length === 0;
            }
        },
        watch: {
            passwd(newVal) {
                // this.passwd = newVal;
                this.checkPasswd();
            },
            passwdRepeat(newVal) {
                // this.passwdRepeat = newVal;
                this.checkPasswd();
            }
        },
        created() {
            userModule.getLoggedIn();
        }
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
