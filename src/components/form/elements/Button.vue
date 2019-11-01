<template>
    <FormElement :disabled="buttonDescriptor.disabled"
                 :name="buttonDescriptor.name"
                 :container-custom-classes="cCustomClasses"
                 :no-label="true">

        <template v-slot:element_content>
            <input :type="buttonDescriptor.type" :name="buttonDescriptor.name"
                   :value="buttonDescriptor.value" :disabled="buttonDescriptor.disabled"/>
        </template>

    </FormElement>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import FormElement from "@/components/form/FormElement.vue";
    import ButtonDescriptor from "../../../assets/ts/form/ButtonDescriptor";

    @Component({
        components: {FormElement}
    })
    export default class Button extends Vue {
        @Prop(Object) buttonDescriptor!: ButtonDescriptor;

        get cCustomClasses() {
            let classes = this.buttonDescriptor.customClasses;
            console.log(this.buttonDescriptor);
            classes.push('form_element_button2');
            return classes;
        }
    }
</script>

<style lang="scss">
    @import "../../../assets/scss/colors";

    .form_element_button2 {
        position: relative;
        display: inline-block;
        background: $shade3;
        padding: 7px;
        font-size: .9rem;
        transition: all .3s;

        input {
            width: 100% !important;
            max-width: initial !important;
            margin-left: 0 !important;
            cursor: pointer;
            background: none;
            border: none;
            padding: 0;
            color: $text;

            &.disabled {
                color: $textDisabled;
            }
        }

        &:hover {
            background-color: $shade2;
        }
    }
</style>
