<template>
    <FormElement :disabled="buttonDescriptor.disabled"
                 :name="buttonDescriptor.name"
                 :container-custom-classes="cCustomClasses"
                 :no-label="true">

        <template v-slot:element_content>
            <button :type="buttonDescriptor.type" :name="buttonDescriptor.name"
                    :value="buttonDescriptor.value" :disabled="buttonDescriptor.disabled" :style="buttonStyle"
                    :class="{isIconButton: buttonDescriptor.isIconButton}">
                <div v-if="hasIcon" class="feb2_content feb2_icon" :class="{padded: hasStringContent}"
                     :style="iconStyle">
                    <span :class="buttonDescriptor.faIcon"></span>
                </div>
                <div v-if="hasStringContent && !buttonDescriptor.isIconButton" class="feb2_content feb2_stringContent">
                    {{buttonDescriptor.value}}
                </div>
            </button>
        </template>

    </FormElement>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import FormElement from "@/components/form/FormElement.vue";
    import ButtonDescriptor from "@/assets/ts/form/ButtonDescriptor";

    @Component({
        components: {FormElement}
    })
    export default class Button extends Vue {
        @Prop(Object) buttonDescriptor!: ButtonDescriptor;

        get cCustomClasses() {
            let classes = this.buttonDescriptor.customClasses;
            classes.push('form_element_button2');
            classes.push('style_' + this.buttonDescriptor.style);
            return classes;
        }

        get buttonStyle() {
            const style: any = {
                borderRadius: this.borderRadius
            };

            const height = this.buttonDescriptor.isIconButton ? this.buttonDescriptor.iconButtonDimension : this.buttonDescriptor.buttonHeight;
            const width = this.buttonDescriptor.isIconButton ? this.buttonDescriptor.iconButtonDimension : this.buttonDescriptor.buttonWidth;

            if (typeof height !== 'undefined') {
                style.height = height + 'px';
            }
            if (typeof width !== 'undefined') {
                style.width = width + 'px';
            }

            return style;
        }

        get iconStyle() {
            const style: any = {};

            if (this.buttonDescriptor.isIconButton) {
                style.width = this.buttonDescriptor.iconButtonDimension + 'px';
            }

            return style;
        }

        get borderRadius() {
            if (this.buttonDescriptor.roundedCorner === true) {
                return '5px';
            } else if (typeof this.buttonDescriptor.roundedCorner === 'number') {
                return this.buttonDescriptor.roundedCorner + 'px';
            } else {
                return '0px';
            }
        }

        get hasIcon() {
            return typeof this.buttonDescriptor.faIcon !== 'undefined' && this.buttonDescriptor.faIcon.length > 0;
        }

        get hasStringContent() {
            return this.buttonDescriptor.value.length > 0;
        }
    }
</script>

<style lang="scss">
    @import "../../../assets/scss/colors";

    .form_element_button2 {
        position: relative;
        font-size: .9rem;
        transition: all .3s;

        button {
            display: flex;
            color: $text;

            &.disabled {
                color: $textDisabled;
            }

            &:not(.isIconButton) .feb2_content {
                padding: 3px 5px;
            }

            &.isIconButton .feb2_content {
                padding: 3px;
            }

            .feb2_icon {
                padding: 3px;
                display: flex;
                flex-direction: column;
                justify-content: center;

                .padded {
                    margin-right: 2px;
                }
            }
        }

        &.style_normal {
            button {
                background-color: $shade3;

                &:hover {
                    background-color: $shade2;
                }
            }
        }

        &.style_negative {
            button {
                background-color: $shade2;
                border: 1px solid $shade2;

                &:hover {
                    background-color: transparent;
                }
            }
        }
    }
</style>
