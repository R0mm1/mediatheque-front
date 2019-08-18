<template>
    <div class="widget_simpleList">
        <div v-for="element in elements" class="list_row" :key="element.id">

            <div class="row_content">{{element.content}}</div>

            <InputButton v-for="(action, actionIndex) in actions" :key="actionIndex"
                         :custom-classes="['row_action']" :label-custom-classes="action.buttonClass"
                         v-on:click.native="action.action(element.id)">
            </InputButton>
        </div>
    </div>
</template>

<script>
    import InputButton from "../form/elements/InputButton";

    export default {
        name: "SimpleList",
        components: {InputButton},
        props: {
            //An array of Element objects
            elements: {default: () => []},
            //An array of Action objects
            actions: {default: () => []}
        }
    }

    let Action = function (buttonClass, action) {
        this.buttonClass = buttonClass;
        this.action = action;
    };

    let Element = function (id, content) {
        this.id = id;
        this.content = content;
    };

    export {Action, Element};
</script>

<style scoped lang="scss">
    @import "../../assets/scss/colors";

    .list_row {
        display: flex;
        height: 24px;
        transition: all 0.3s;
        border-style: solid;
        border-width: 1px 0 1px 0;
        border-color: transparent;

        &:hover {
            border-color: $shade1;
        }

        .form_element_button {
            height: 14px;
            width: 14px;
            font-size: .8rem;
            padding: 3px;
            margin: 2px;
            border-radius: 50%;
            text-align: center;
        }
    }

    .row_content {
        flex: 1;
        line-height: 24px;
    }
</style>