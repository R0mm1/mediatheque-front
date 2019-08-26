<template>
    <div id="med_popup_topbuttonbar">
        <InputButton v-for="button in buttons" :key="button.tabName"
                     v-on:click.native="setTab(button.tabName)"
                     :label-custom-classes="button.iconClassName"
                     :custom-classes="cIsSelected(button.tabName)">
        </InputButton>

        <InputButton v-on:click.native="$emit('popup-wanna-close')"
                     label-custom-classes="fas fa-times"></InputButton>
    </div>
</template>

<script>
    import InputButton from "../form/elements/InputButton";

    export default {
        name: "TopButtonBar",
        components: {InputButton},
        props: {
            buttons: {type: Array, default: () => []},
            defaultTab: {type: String, required: true}
        },
        data() {
            return {
                selectedTabName: null
            }
        },
        methods: {
            setTab(tabName) {
                this.selectedTabName = tabName;
                this.$emit('tab-button-clicked', tabName);
            },
            cIsSelected(tabName) {
                return (this.selectedTabName === null && tabName === this.defaultTab) || (tabName === this.selectedTabName) ? ['selected'] : [];
            }
        }
    }

    const TopButtonBarElement = function (iconClassName, tabName) {
        this.iconClassName = iconClassName;
        this.tabName = tabName;
    };

    export {TopButtonBarElement};
</script>

<style lang="scss">
    @import "../../assets/scss/colors";

    #med_popup_topbuttonbar {
        display: flex;

        > .form_element {
            width: 4rem;
            margin: 0;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: center;

            &.selected:after {
                content: ' ';
                display: block;
                background-color: $shade1;
                width: 100%;
                height: 3px;
                position: absolute;
                bottom: 0;
                left: 0;
            }

            label {
                font-size: 2rem;
            }
        }
    }
</style>
