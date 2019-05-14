<template>
    <FormElement :label="label" :disabled="disabled" :name="name"
                 :container-custom-classes="cCustomClasses" :no-label="noLabel">

        <template v-slot:element_content>
            <input type="text" :name="name" v-model="elValue" :placeholder="placeholder"
                   v-on:change="$emit('input-text-changed', name, elValue)"
                   v-on:keyup="$emit('input-text-keyup', name, elValue)"/>
        </template>

    </FormElement>
</template>

<script>
    import FormElement from "../FormElement";

    export default {
        name: "InputText",
        components: {FormElement},
        props: {
            placeholder: {default: ''},
            label: {default: ''},
            value: {default: ''},
            disabled: {default: false},
            name: {default: ''},
            customClasses: {default: ''},
            noLabel: {default: false, type: Boolean}
        },
        data() {
            return {
                'elValue': ''
            }
        },
        methods: {
            clear() {
                this.elValue = '';
            },
            getValue() {
                return this.elValue;
            }
        },
        computed: {
            cCustomClasses() {
                let classes = ['form_element_text', this.customClasses];
                return classes;
            }
        },
        watch: {
            value(newValue) {
                this.elValue = newValue;
            }
        }
    }
</script>

<style lang="scss">
    .form_element_text {
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