<template>
    <div id="leftActionBar">
        <div id="labColorBar"></div>
        <bar-element v-if="leftActionBarProperties.hasAddButton" icon="fas fa-plus" text="Ajouter"
                     v-on:click.native="$parent.$emit('list-action-add')"></bar-element>

        <bar-element v-for="(labButton, index) in leftActionBarProperties.customButtons"
                     :icon="labButton.icon" :text="labButton.label" :key="index"
                     v-on:click.native="labButton.callback"></bar-element>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import LeftActionBarProperties from "../../assets/ts/list/LeftActionBarProperties";

    @Component({
        components: {
            BarElement: () => import('@/components/list/leftActionBar/BarElement.vue')
        }
    })
    export default class LeftActionBar extends Vue {
        @Prop(Object) leftActionBarProperties!: LeftActionBarProperties;
    }
</script>

<style scoped lang="scss">
    #labColorBar {
        height: 100%;
        width: 30px;
        position: fixed;
        background-color: #e4dccc;
    }
</style>
