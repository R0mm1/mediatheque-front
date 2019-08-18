<template>
    <FormElement :label="value" :disabled="disabled" :name="name" :container-custom-classes="cCustomClasses"
                 :label-custom-classes="labelCustomClasses" :hide-content="true">

        <template v-slot:element_content>
            <input ref="input" :type="type" :name="name" :value="value"/>
        </template>

    </FormElement>
</template>

<script>
    import FormElement from "../FormElement";

    export default {
        name: "InputButton",
        components: {FormElement},
        props: {
            type: {default: 'button'}, //can be "submit" too
            value: {default: ''},
            name: {default: ''},
            disabled: {default: false},
            customClasses: {default: () => [], type: Array},
            labelCustomClasses: {default: ''}
        },
        computed: {
            cCustomClasses() {
                let classes = this.customClasses;
                classes.push('form_element_button');
                return classes;
            }
        }
    }
</script>

<style lang="scss">

    .form_element_button {
        position: relative;
        display: inline-block;
        background: #f8f3ea;
        padding: 7px;
        font-size: .9rem;
        transition: all .3s;

        input {
            display: none;
        }

        label {
            width: 100% !important;
            max-width: initial !important;
            margin-left: 0px !important;

            &.disabled {
                color: #6b6b6b;
            }
        }

        &:hover {
            background-color: #e4dccc;
        }
    }
</style>