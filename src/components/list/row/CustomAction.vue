<template>
    <div class="rowCustomAction" v-if="rowAction.isDisplayed(rowData)">
        <InputButton value="" :label-custom-classes="rowAction.iconClassname"
                     v-on:click.native="triggerCustomAction"></InputButton>

        <div class="customActionConfirm" v-if="rowAction.needConfirm" :class="{isDisplayed: confirmDisplayed}">
            {{rowAction.confirmMessage}}
        </div>
    </div>

</template>

<script lang="ts">
    import RowAction from "@/assets/ts/list/RowAction";
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component({
        components: {
            InputButton: () => import("../../form/elements/InputButton.vue")
        }
    })
    export default class CustomAction extends Vue {
        @Prop(Object) rowAction!: RowAction;
        @Prop(Object) rowData!: object;

        clickCounter: number = 0;
        confirmDisplayed: boolean = false;

        triggerCustomAction(event: MouseEvent) {

            this.clickCounter++;

            let triggerEvent = true;
            if (this.rowAction.needConfirm) {
                if (this.clickCounter === 1) {
                    this.confirmDisplayed = true;
                    triggerEvent = false;
                }
            }

            if (triggerEvent) {
                this.$emit('custom-action-triggered', this.rowAction.id);
                this.confirmDisplayed = false;
                this.clickCounter = 0;
            }

            event.stopPropagation();
        }
    }
</script>

<style scoped lang="scss">
    .rowCustomAction{
        position: relative;
    }

    .form_element_button {
        border-radius: 50%;
        width: 13px;
        height: 13px;
        text-align: center;
        font-size: .8rem;
    }

    .customActionConfirm {
        font-size: .8rem;
        background-color: black;
        color: white;
        padding: 2px;
        position: absolute;
        transform: translateX(-50%);

        &:not(.isDisplayed) {
            display: none;
        }
    }
</style>
