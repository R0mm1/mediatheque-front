<template>
    <Group>
        <template v-slot:group_name>
            Couverture
        </template>
        <template v-slot:group_content>
            <InputPicture name="picture" :src="src" v-on:picture-changed="pictureChanged"></InputPicture>
        </template>
    </Group>
</template>

<script>
    import Xhr from "../../../../../assets/js/xhr";
    import Group from "../../../../popup/Group";
    import InputPicture from "../../../../form/elements/InputPicture";

    import store from "../../../../../assets/js/store";
    import {mapState} from 'vuex';
    import BookModule from "../../../../../assets/js/store/book";

    if (!store.state['book']) {
        store.registerModule('book', BookModule);
    }

    export default {
        name: "GroupPicture",
        components: {InputPicture, Group},
        data() {
            return {
                src: ''
            }
        },
        methods: {
            pictureChanged(newFile) {
                this.$store.dispatch('setCover', {
                    file: newFile
                });
            }
        },
        computed: mapState({
            cover: state => {
                return state.book.book.cover ? state.book.book.cover : ''
            }
        }),
        watch: {
            cover(cover) {
                if (cover.length === 0) return;

                Xhr.buildGetUrl(cover)
                    .then(url => {
                        return Xhr.fetch(url, {});
                    })
                    .then(response => response.blob())
                    .then(data => {
                        const urlCreator = window.URL || window.webkitURL;
                        this.src = urlCreator.createObjectURL(data);
                    });
            }
        },
        store
    }
</script>

<style scoped>

</style>
