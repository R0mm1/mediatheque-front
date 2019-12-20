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
    import Xhr from "../../../../../../assets/js/xhr";
    import Group from "../../../../../popup/Group";
    import InputPicture from "../../../../../form/elements/InputPicture";

    export default {
        name: "GroupPicture",
        components: {InputPicture, Group},
        props: {bookStore: {required: true}},
        data() {
            return {
                src: ''
            }
        },
        methods: {
            pictureChanged(newFile) {
                this.bookStore.unlinkCover();
                this.bookStore.linkNewCover({
                    file: newFile,
                    name: newFile.name
                });
            },
            load() {
                if (this.cover.length === 0) return;

                const setFile = (file) => {
                    const urlCreator = window.URL || window.webkitURL;
                    this.src = urlCreator.createObjectURL(file);
                };

                if (this.cover instanceof File) {
                    setFile(this.cover);
                } else {
                    Xhr.buildGetUrl(this.cover)
                        .then(url => {
                            return Xhr.fetch(url, {});
                        })
                        .then(response => response.blob())
                        .then(data => setFile(data));
                }
            }
        },
        computed: {
            cover() {
                const cover = this.bookStore.book.cover;

                if (typeof cover === 'undefined' || cover === null) {
                    return '';
                } else if (typeof cover === 'string') {
                    return cover;
                } else if (typeof cover === 'object' && typeof cover["@id"] !== 'undefined') {
                    return cover["@id"];
                } else if (typeof cover === 'object' && cover.id === 0 && this.bookStore.tempNewCover instanceof File) {
                    return this.bookStore.tempNewCover;
                }
                return '';
            }
        },
        watch: {
            cover(cover) {
                this.load();
            }
        },
        created() {
            this.load();
        }
    }
</script>

<style scoped>

</style>
