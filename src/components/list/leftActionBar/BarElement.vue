<template>
    <div class="leftActionBarElement">

        <div class="leftActionBarElementIcon" :class="element.elementDescriptor.faIcon"></div>

        <div class="leftActionBarElementText">
            <Button v-if="isButton" :button-descriptor="element.elementDescriptor"
                    v-on:click.native="element.callback"/>
            <Select2 v-if="isSelect" :select-descriptor="element.elementDescriptor" v-on:change="executeCallback"/>
        </div>

    </div>
</template>

<script lang="ts">

    import {Component, Prop, Vue} from "vue-property-decorator";
    import LeftActionBarElement from "@/assets/ts/list/LeftActionBarElement";
    import ButtonDescriptor from "@/assets/ts/form/ButtonDescriptor";
    import LeftActionBarFormSelectDescriptor from "@/assets/ts/list/LeftActionBarFormSelectDescriptor";

    @Component({
        components: {
            Select2: () => import( "@/components/form/elements/Select2.vue"),
            Button: () => import("@/components/form/elements/Button.vue")
        }
    })
    export default class BarElement extends Vue {
        @Prop(Object) element!: LeftActionBarElement;

        get isButton() {
            return this.element.elementDescriptor.constructor.name === ButtonDescriptor.name;
        }

        get isSelect() {
            return this.element.elementDescriptor.constructor.name === LeftActionBarFormSelectDescriptor.name;
        }

        executeCallback(e: any) {
            this.element.callback(e, this.element);
        }
    }
</script>

<style lang="scss">
    .leftActionBarElement {
        line-height: 30px;
        height: 30px;
        cursor: pointer;
        z-index: 1;
        display: flex;

        .leftActionBarElementIcon {
            width: 30px;
            min-width: 30px;
            text-align: center;
            display: inline-block;
            transition: background-color .3s, color .3s;
            font-size: 1rem;
            height: 30px;
            line-height: 30px;
        }

        .leftActionBarElementText {
            transition: background-color .3s;
            width: 100%;
            padding-left: 3px;

            .form_element {
                margin: 0 !important;
            }

            .form_element_select2 {
                .element_content {
                    margin-right: 0 !important;
                }

                .v-menu__content, .v-select-list {
                    box-shadow: none !important;
                }

                .v-menu__content {
                    max-width: none !important;
                    width: calc(100% + 3px);
                    left: -3px !important;
                }
            }

            .form_element_button2 {
                padding: 0 !important;
                background: transparent !important;

                input {
                    text-align: left;
                    font-size: initial;
                }
            }
        }

        &:hover .leftActionBarElementIcon {
            background-color: #bbaf99;
        }

        &:hover .leftActionBarElementText {
            background-color: #e4dccc;
        }
    }
</style>
