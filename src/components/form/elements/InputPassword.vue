<template>
    <FormElement :label="label" :name="name" :container-custom-classes="cCustomClasses">

        <template v-slot:element_content>
            <input type="password" :name="name" :placeholder="placeholder"
                   v-on:input="$emit('input', $event.target.value)"/>
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
            labelBreakpoint: {default: false, type: Boolean}
        },
        computed: {
            cCustomClasses() {
                const classes = ['form_element_password', this.customClasses];
                if (this.labelBreakpoint) {
                    classes.push('label_breakpoint');
                }
                return classes;
            }
        },
    }
</script>

<style lang="scss">
    @import "../../../assets/scss/breakpoints";
    @import "../../../assets/scss/colors";

    .form_element_password {
        label, input {
            height: 2rem;
            line-height: 2rem;
        }

        input {
            width: calc(100% - 6px);
            height: calc(100% - 6px);
            border: 1px solid $shade3;
            padding: 2px;
            background-color: white;
        }

        @include phone-portrait {
            &.label_breakpoint {
                flex-direction: column;

                label {
                    width: initial;
                }
            }
        }
    }
</style>
