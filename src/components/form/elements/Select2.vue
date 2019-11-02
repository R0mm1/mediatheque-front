<template>
    <FormElement container-custom-classes="form_element_select2" :no-label="selectDescriptor.noLabel">
        <template v-slot:element_content>
            <v-select :items="cOptions" :searchable="cIsSearchable" v-model="dataValue" :attach="element"
                      v-on:change="change"></v-select>
        </template>
    </FormElement>

</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from "vue-property-decorator";
    import SelectDescriptor from "@/assets/ts/form/SelectDescriptor";
    import FormElement from "@/components/form/FormElement.vue";
    import LeftActionBarFormSelectDescriptor from "@/assets/ts/list/LeftActionBarFormSelectDescriptor";

    @Component({
        components: {FormElement}
    })
    export default class Select2 extends Vue {
        @Prop(Object) selectDescriptor!: SelectDescriptor;

        @Prop({type: Boolean, default: SelectDescriptor.defaultSearchable}) searchable!: boolean;
        @Prop({
            type: Object, default: () => {
            }
        }) options!: any;
        @Prop({type: String, default: ''}) value!: string;

        dataValue?: string;
        id?: number;
        element: (Node | null) = null;

        get cIsSearchable() {
            return this.hasDescriptorProvided ? this.selectDescriptor.searchable : this.searchable;
        }

        get cOptions() {
            return this.hasDescriptorProvided ? this.selectDescriptor.getOptionsAsObjects() : this.options;
        }

        get cValue() {
            return this.hasDescriptorProvided ? this.selectDescriptor.value : this.value;
        }

        get hasDescriptorProvided() {
            return this.selectDescriptor instanceof SelectDescriptor;
        }

        @Emit()
        change(value: any) {
            return value;
        }

        mounted() {
            this.element = this.$el.querySelector('.element_content');
        }

        created() {
            this.dataValue = this.cValue;
        }
    }
</script>

<style lang="scss">
    @import "../../../assets/scss/colors";

    .form_element_select2 {

        .element_content {
            position: relative;

            .v-menu__content, .v-select-list {
                border-radius: unset !important;
            }

            .v-input__slot {
                height: 2rem;
            }

            .v-menu__content {
                top: 0 !important;
            }

            .v-text-field {
                margin-top: 0 !important;
                padding-top: 0 !important;
            }

            .v-select__selections input {
                padding: 0 !important;
            }

            .v-select__selection--comma {
                margin: 0 !important;
            }

            .v-input__append-inner {
                margin-top: 0 !important;
            }

            .v-input__slot::before, .v-input__slot::after {
                border-style: none !important;
            }
        }
    }

</style>
