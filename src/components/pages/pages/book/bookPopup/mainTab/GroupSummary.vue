<template>
    <Group id="groupBookSummary">
        <template v-slot:group_name>
            Résumé
        </template>


        <template v-slot:group_content>
            <Wysiwyg id="wysiwygSummary" name="summary" :no-label="true" :content="summary"
                     v-on:content-changed="summaryChanged"></Wysiwyg>
        </template>

    </Group>
</template>

<script>
    import Group from "../../../../../popup/Group";
    import Wysiwyg from "../../../../../form/elements/Wysiwyg";

    export default {
        name: "GroupSummary",
        components: {Wysiwyg, Group},
        props: {bookStore: {required: true}},
        methods: {
            summaryChanged(newContent) {
                this.bookStore.setSummary(newContent);
            }
        },
        computed: {
            summary() {
                let summary = this.bookStore.book.summary;
                if (summary === null) {
                    summary = '';
                }
                return summary;
            }
        }
    }
</script>

<style lang="scss">
    #groupBookSummary {
        #wysiwygSummary {
            .ck.ck-editor {
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .ck.ck-editor__main {
                flex: 1;
            }

            .ck.ck-content {
                height: 100%;
            }
        }
    }
</style>
