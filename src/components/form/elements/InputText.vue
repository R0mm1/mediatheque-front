<template>
    <FormElement :label="label" :disabled="disabled" :name="name"
                 :container-custom-classes="cCustomClasses" :no-label="noLabel">

        <template v-slot:element_content>
            <!-- todo: Both input-text-changed and input-text-keyup events are to be removed in the future-->
            <input type="text" :name="name" v-model="elValue" :placeholder="placeholder"
                   v-on:input="$emit('input', elValue)"
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
            noLabel: {default: false, type: Boolean},
            labelBreakpoint: {default: false, type: Boolean}
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
            },
            emitEvent(name, elValue) {

            }
        },
        computed: {
            cCustomClasses() {
                const classes = ['form_element_text', this.customClasses];
                if (this.labelBreakpoint) {
                    classes.push('label_breakpoint');
                }
                return classes;
            }
        },
        watch: {
            value(newValue) {
                this.elValue = newValue;
            }
        },
        created() {
            this.elValue = this.value;
        }
    }
</script>

<style lang="scss">
    @import "../../../assets/scss/breakpoints";
    @import "../../../assets/scss/colors";

    .form_element_text {
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
