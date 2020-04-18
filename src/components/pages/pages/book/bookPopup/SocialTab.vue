<template>
    <Tab>
        <template v-slot:tab_content>
            <GroupBookRead :book-store="bookStore"></GroupBookRead>
        </template>
    </Tab>
</template>

<script>
    import Tab from "../../../../popup/Tab";
    import GroupBookRead from "./socialTab/GroupBookRead";

    export default {
        name: "SocialTab",
        components: {GroupBookRead, Tab},
        props: {bookStore: {type: Object, required: true}}
    }
</script>

<style scoped>

</style>
