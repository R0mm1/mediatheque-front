<template>
    <Tab>
        <template v-slot:tab_content>
            <GroupPicture class="groupPicture"></GroupPicture>
            <div class="bookPopupColumn">
                <GroupSummary class="groupSummary"></GroupSummary>
                <GroupReferences></GroupReferences>
            </div>
            <GroupInformation class="groupInformation" :book-store="bookStore"></GroupInformation>
        </template>
    </Tab>
</template>

<script>
    import GroupInformation from "./mainTab/GroupInformation";
    import GroupPicture from "./mainTab/GroupPicture";
    import GroupSummary from "./mainTab/GroupSummary";
    import GroupReferences from "./mainTab/GroupReferences";

    import Tab from "../../../../popup/Tab";

    export default {
        name: "MainTab",
        components: {Tab, GroupReferences, GroupSummary, GroupPicture, GroupInformation},
        props: {bookStore: {type: Object, required: true}}
    }
</script>

<style scoped lang="scss">
    .groupPicture {
        width: 10%;
        min-width: 150px;
    }

    .groupSummary {
        height: 50%;
    }

    .groupInformation {
        min-width: 450px;
        width: 50%;
    }

    .bookPopupColumn {
        flex: 1;
    }
</style>
