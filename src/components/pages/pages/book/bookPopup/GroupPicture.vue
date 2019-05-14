<template>
    <Group>
        <template v-slot:group_name>
            Couverture
        </template>
        <template v-slot:group_content>
            <InputPicture :name="'picture'" v-on:picture-changed="pictureChanged"></InputPicture>
        </template>
    </Group>
</template>

<script>
    import Group from "../../../../popup/Group";
    import InputPicture from "../../../../form/elements/InputPicture";

    import store from "../../../../../assets/js/store";
    import BookModule from "../../../../../assets/js/store/book";

    if (!store.state['book']) {
        store.registerModule('book', BookModule);
    }

    export default {
        name: "GroupPicture",
        components: {InputPicture, Group},
        methods: {
            pictureChanged(newFile) {
                this.$store.dispatch('setCover', {
                    file: newFile
                });
            }
        },
        store
    }
</script>

<style scoped>

</style>