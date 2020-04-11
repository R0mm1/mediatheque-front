<template>
    <FormElement :label="value" :disabled="disabled" :name="name" :container-custom-classes="cCustomClasses"
                 :label-custom-classes="labelCustomClasses" :hide-content="true">

        <template v-slot:element_content>
            <input ref="input" :type="type" :name="name" :value="value" :disabled="disabled"/>
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
            labelCustomClasses: {default: ''},
            bStyle: {type: String, default: 'normal'}
        },
        computed: {
            cCustomClasses() {
                let classes = this.customClasses;
                classes.push('form_element_button');
                classes.push('style_' + this.bStyle);
                return classes;
            }
        }
    }
</script>

<style lang="scss">
    @import "../../../assets/scss/colors";

    .form_element_button {
        position: relative;
        display: inline-block;
        background: $shade3;
        padding: 7px;
        font-size: .9rem;
        transition: all .3s;
        border: 1px solid transparent;

        input {
            display: none;
        }

        label {
            width: 100% !important;
            max-width: initial !important;
            margin-left: 0 !important;

            &.disabled {
                color: $textDisabled;
            }
        }

        &.style_normal{
            &:hover {
                background-color: $shade2;
            }
        }

        &.style_negative{
            background-color: $shade2;
            border: 1px solid $shade2;
            &:hover{
                background-color: transparent;
            }
        }
    }
</style>
