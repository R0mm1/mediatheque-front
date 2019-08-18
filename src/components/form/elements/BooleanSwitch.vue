<template>
    <FormElement :label="label" :name="name" container-custom-classes="form_element_boolean_switch">

        <template v-slot:element_content>
            <div class="switch_container" v-on:click="toggle">
                <div class="switch_indicator_container" :class="{'enabled': enabled}">
                    <div class="switch_indicator"></div>
                </div>
            </div>
        </template>

    </FormElement>
</template>

<script>
    import FormElement from "../FormElement";

    export default {
        name: "BooleanSwitch",
        components: {FormElement},
        props: {
            label: {default: '', type: String},
            name: {default: '', type: String},
            value: {default: false, type: Boolean}
        },
        data() {
            return {
                enabled: false
            }
        },
        methods: {
            toggle() {
                this.enabled = !this.enabled;
                this.$emit('boolean-switch-state-changed', this.name, this.enabled);
            }
        },
        watch: {
            value(newVal) {
                this.enabled = newVal;
            }
        },
        mounted() {
            this.enabled = this.value;
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/scss/colors";

    .form_element_boolean_switch {
        line-height: 2rem;
    }

    .switch_container {
        height: 2rem;
        vertical-align: middle;
        display: table-cell;
    }

    .switch_indicator_container {
        height: 21px;
        border: 1px solid $shade1;
        width: 50px;
        border-radius: 10px;
        background-color: transparent;
        transition: all .3s;

        .switch_indicator {
            border: 1px solid $shade1;
            height: 15px;
            width: 15px;
            border-radius: 50%;
            margin: 2px;
            background-color: $shade4;
            transition: all .3s;
        }

        &.enabled {
            background-color: $shade1;

            .switch_indicator {
                transform: translateX(28px);
            }
        }
    }
</style>