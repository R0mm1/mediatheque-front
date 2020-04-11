<template>
    <Page :no-user="true" custom-header-message="Bienvenue!">

        <template v-slot:med_page_body>

            <FormContainer validate-label="Se connecter" :validate-action="login">
                <template v-slot:form_title>
                    Se connecter
                </template>

                <template v-slot:form_body>
                    <InputText v-model="userLogin" label="Identifiant"></InputText>
                    <InputPassword v-model="userPassword" label="Mot de passe"></InputPassword>
                </template>

                <template v-slot:action_cancel>
                    <span></span>
                </template>

            </FormContainer>

        </template>

    </Page>
</template>

<script>
    import {container} from 'tsyringe';

    import config from './../../../../mediatheque';

    import Page from './../Page';
    import FormContainer from "../../form/FormContainer";
    import InputText from "../../form/elements/InputText";
    import InputPassword from "../../form/elements/InputPassword";
    import AuthenticationService from "../../../assets/ts/service/AuthenticationService";

    const authenticationService = container.resolve(AuthenticationService);

    export default {
        name: "Login",
        components: {InputText, InputPassword, FormContainer, Page},
        data() {
            return {
                userLogin: '',
                userPassword: ''
            }
        },
        methods: {
            login() {
                authenticationService.login(this.userLogin, this.userPassword)
                    .then(() => {
                        window.location = config.default.page;
                    })
                    .catch(httpErrorCode => {

                        const message = (httpErrorCode === 401) ? "Identifiant ou mot de passe invalide" : "Une erreur est survenue";

                        this.$toasted.show(message, {
                            ...config.default.notification_settings,
                            type: 'error',
                            icon: 'fa-times',
                        });
                    });
            }
        }
    }
</script>

<style scoped lang="scss">
    .med_form {
        width: 500px;
        margin: 100px auto;
        box-shadow: 1px 1px 5px #e4dccc;
        padding: 10px;
    }
</style>
