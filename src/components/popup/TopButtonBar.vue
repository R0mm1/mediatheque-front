<template>
    <div id="med_popup_topbuttonbar">
        <InputButton v-for="button in buttons" :key="button.tabName"
                     v-on:click.native="setTab(button)"
                     :label-custom-classes="button.iconClassName"
                     :custom-classes="cClasses(button)"
                     :disabled="!button.isActive">
        </InputButton>

        <InputButton v-on:click.native="$emit('popup-wanna-close')"
                     label-custom-classes="fas fa-times"/>
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
            setTab(topButtonBarElement) {
                if (topButtonBarElement.isActive) {
                    this.selectedTabName = topButtonBarElement.tabName;
                    this.$emit('tab-button-clicked', topButtonBarElement.tabName);
                }
            },
            cClasses(topButtonBarElement) {
                let classes = [topButtonBarElement.tabName];

                if ((this.selectedTabName === null && topButtonBarElement.tabName === this.defaultTab) || (topButtonBarElement.tabName === this.selectedTabName)) {
                    classes.push('selected');
                }

                return classes;
            }
        }
    }

    const TopButtonBarElement = function (iconClassName, tabName, isActive) {
        this.iconClassName = iconClassName;
        this.tabName = tabName;
        this.isActive = (typeof isActive === 'boolean') ? isActive : true;
    };

    export {TopButtonBarElement};
</script>

<style lang="scss">
    @import "../../assets/scss/colors";
    @import "../../assets/scss/breakpoints";

    #med_popup_topbuttonbar {
        display: flex;

        > .form_element {
            width: 4rem;
            margin: 0;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: center;

            @include phone-portrait {
                width: 1rem;
            }

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

                @include phone-portrait {
                    font-size: 1rem;
                }
            }
        }
    }
</style>
