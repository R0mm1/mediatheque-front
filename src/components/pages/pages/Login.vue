<template>
    <Page :no-user="true" custom-header-message="Bienvenue!">

        <template v-slot:med_page_body>

            <FormContainer validate-label="Se connecter" :validate-action="login">
                <template v-slot:form_title>
                    Se connecter
                </template>

                <template v-slot:form_body>
                    <InputText ref="login" label="Identifiant"></InputText>
                    <InputPassword ref="password" label="Mot de passe"></InputPassword>
                </template>

                <template v-slot:action_cancel>
                    <span></span>
                </template>

            </FormContainer>

        </template>

    </Page>
</template>

<script>
    import Xhr from './../../../assets/js/xhr';
    import Page from './../Page';
    import FormContainer from "../../form/FormContainer";
    import InputText from "../../form/elements/InputText";
    import InputPassword from "../../form/elements/InputPassword";

    export default {
        name: "Login",
        components: {InputText, InputPassword, FormContainer, Page},
        methods: {
            login() {
                Xhr.login(this.$refs.login.getValue(), this.$refs.password.getValue());
            }
        }
    }
</script>

<style scoped lang="scss">
    .med_form{
        width: 500px;
        margin: 100px auto;
        box-shadow: 1px 1px 5px #e4dccc;
        padding: 10px;
    }
</style>