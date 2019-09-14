<template>
    <Tab>
        <template v-slot:tab_content>
            <GroupBookRead></GroupBookRead>
        </template>
    </Tab>
</template>

<script>
    import Tab from "../../../../popup/Tab";
    import GroupBookRead from "./socialTab/GroupBookRead";

    export default {
        name: "SocialTab",
        components: {GroupBookRead, Tab}
    }
</script>

<style scoped>

</style>
