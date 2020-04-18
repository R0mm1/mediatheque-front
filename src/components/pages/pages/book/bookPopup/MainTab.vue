<template>
    <Tab class="book_main_tab">
        <template v-slot:tab_content>
            <GroupPicture :book-store="bookStore" class="groupPicture"/>
            <GroupSummary :book-store="bookStore" class="groupSummary"/>
            <Column>
                <template v-slot:column_content>
                    <GroupInformation class="groupInformation" :book-store="bookStore"/>
                    <GroupReferences :book-store="bookStore"/>
                </template>
            </Column>
        </template>
    </Tab>
</template>

<script>
    import GroupInformation from "./mainTab/GroupInformation";
    import GroupPicture from "./mainTab/GroupPicture";
    import GroupSummary from "./mainTab/GroupSummary";
    import GroupReferences from "./mainTab/GroupReferences";

    import Tab from "../../../../popup/Tab";
    import Column from "../../../../popup/Column";

    export default {
        name: "MainTab",
        components: {Column, Tab, GroupReferences, GroupSummary, GroupPicture, GroupInformation},
        props: {bookStore: {type: Object, required: true}}
    }
</script>

<style scoped lang="scss">
    .groupPicture {
        width: 160px;
    }

    .groupSummary {
        flex: 1;
    }

    .groupInformation {
        max-width: 500px;
    }
</style>

<style lang="scss">
    .book_main_tab .groupInformation {
        .form_element label {
            width: 50% !important;
            max-width: 150px !important;
        }

        .form_element_files {
            flex-direction: column;
        }
    }
</style>
