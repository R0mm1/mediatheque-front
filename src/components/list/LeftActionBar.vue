<template>
    <div id="leftActionBar">
        <div id="labColorBar"></div>
        <div id="labElements">
            <bar-element v-if="leftActionBarProperties.hasAddButton" :element="buttonAddElement"></bar-element>

            <template v-for="(labElement, index) in leftActionBarProperties.customElements">
                <bar-element v-if="isElement(labElement)" :element="labElement" :key="index"/>
                <bar-separator v-if="isSeparator(labElement)" :separator="labElement" :key="index"/>
            </template>
        </div>


    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import LeftActionBarProperties from "../../assets/ts/list/LeftActionBarProperties";
    import ButtonDescriptor from "@/assets/ts/form/ButtonDescriptor";
    import LeftActionBarElement from "@/assets/ts/list/LeftActionBarElement";
    import LeftActionBarSeparator from "@/assets/ts/list/LeftActionBarSeparator";

    @Component({
        components: {
            BarSeparator: () => import("@/components/list/leftActionBar/BarSeparator.vue"),
            BarElement: () => import('@/components/list/leftActionBar/BarElement.vue')
        }
    })
    export default class LeftActionBar extends Vue {
        @Prop(Object) leftActionBarProperties!: LeftActionBarProperties;

        buttonAddElement = new LeftActionBarElement(
            () => {
                this.$parent.$emit('list-action-add')
            },
            new ButtonDescriptor('add', 'Ajouter').setFaIcon('fas fa-plus')
        );

        isElement(element: LeftActionBarElement | LeftActionBarSeparator) {
            return typeof (element as any).elementDescriptor !== 'undefined';
        }

        isSeparator(element: LeftActionBarElement | LeftActionBarSeparator) {
            return !this.isElement(element);
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/scss/breakpoints";

    @include phone-portrait {
        #leftActionBar {
            display: none;
        }
    }

    #labColorBar {
        height: 100%;
        width: 30px;
        position: fixed;
        background-color: #e4dccc;
    }

    #labElements {
        position: relative;
        overflow: hidden;
        height: 100%;
    }
</style>
