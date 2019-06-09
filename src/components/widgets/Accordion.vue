<template>
    <div class="widget_accordion">
        <div v-for="bloc in blocs" :key="bloc.slotId">
            <div class="bloc_title">{{bloc.title}}</div>
            <slot :name="bloc.slotId"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Accordion",
        props: {
            blocs: {default: []}
        }
    }

    /**
     * Object representing a bloc of the accordion
     * @param title string
     * @param slotId string
     */
    let AccordionBloc = function (title, slotId) {
        this.title = title;
        this.slotId = slotId;
    };

    export {AccordionBloc};
</script>

<style scoped lang="scss">
    .bloc_title {
        background-color: #e4dccc;
        padding: 3px;
        margin-bottom: 3px;

        &:nth-child(n+1) {
            margin-top: 3px;
        }
    }
</style>