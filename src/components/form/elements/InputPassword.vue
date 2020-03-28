<template>
    <FormElement :label="label" :name="name" :container-custom-classes="'form_element_password'">

        <template v-slot:element_content>
            <!--todo: input-password-changed should be removed-->
            <input type="password" :name="name" :placeholder="placeholder" v-model="password"
                   v-on:input="$emit('input', password)"
                   v-on:change="$emit('input-password-changed', name, password)"/>
        </template>

    </FormElement>
</template>

<script>
    import FormElement from "./../FormElement";

    export default {
        name: "InputPassword",
        components: {FormElement},
        props: {
            placeholder: {default: ''},
            label: {default: ''},
            value: {default: ''},
            name: {default: ''},

        },
        data: function () {
            return {
                password: ''
            }
        },
        methods: {
            getValue() {
                return this.password;
            }
        }
    }
</script>

<style lang="scss">
    .form_element_password {
        height: 2rem;
        line-height: 2rem;

        input {
            width: calc(100% - 6px);
            height: calc(100% - 6px);
            border: 1px solid #f8f3ea;
            padding: 2px;
        }
    }
</style>
