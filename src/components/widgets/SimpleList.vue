<template>
    <div class="widget_simpleList">
        <div v-for="element in elements" class="list_row" :key="element.id">

            <div class="row_content">{{element.content}}</div>

            <Button v-for="(action, actionIndex) in actions" :key="actionIndex"
                    :button-descriptor="action.buttonDescriptor"
                    v-on:click.native="action.action(element.id)">
            </Button>
        </div>
    </div>
</template>

<script>
    import Button from "../form/elements/Button";

    export default {
        name: "SimpleList",
        components: {Button},
        props: {
            //An array of Element objects
            elements: {default: () => []},
            //An array of Action objects
            actions: {default: () => []}
        }
    }

    let Action = function (buttonDescriptor, action) {
        this.buttonDescriptor = buttonDescriptor;
        this.buttonDescriptor
            .setStyle('negative')
            .addCustomClass('row_action')
            .setRoundedCorner(true)
            .setIsIconButon(true, 24);
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
        height: 30px;
        line-height: 30px;
        transition: all 0.3s;
        border-style: solid;
        border-width: 1px 0 1px 0;
        border-color: transparent;

        &:hover {
            border-color: $shade1;
        }

        .form_element_button2 {
            font-size: .8rem;
            margin: 2px;

            &:last-of-type {
                margin-right: 0;
            }
        }
    }

    .row_content {
        flex: 1;
    }
</style>
