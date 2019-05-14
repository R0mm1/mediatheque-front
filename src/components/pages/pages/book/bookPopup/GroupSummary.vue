<template>
    <Group id="groupBookSummary">
        <template v-slot:group_name>
            Résumé
        </template>


        <template v-slot:group_content>
            <Wysiwyg id="wysiwygSummary" :name="'summary'" :no-label="true" :content="cSummary"
                     v-on:content-changed="summaryChanged"></Wysiwyg>
        </template>

    </Group>
</template>

<script>
    import Group from "../../../../popup/Group";
    import Wysiwyg from "../../../../form/elements/Wysiwyg";

    import store from "../../../../../assets/js/store";
    import BookModule from "../../../../../assets/js/store/book";

    if (!store.state['book']) {
        store.registerModule('book', BookModule);
    }

    export default {
        name: "GroupSummary",
        components: {Wysiwyg, Group},
        methods: {
            summaryChanged(newContent) {
                this.$store.commit('setProperty', {
                    propertyName: 'summary',
                    value: newContent
                });
            }
        },
        computed: {
            cSummary(){
                return this.$store.getters.getProperty('summary');
            }
        },
        store
    }
</script>

<style lang="scss">
    #groupBookSummary {
        #wysiwygSummary {
            height: 100%;

            .ck.ck-editor {
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .ck.ck-toolbar {
                margin-top: -40px;
                opacity: 0;
                visibility: hidden;
                transition: all .3s;
            }

            .ck.ck-editor__main {
                flex: 1;
            }

            .ck.ck-content {
                height: 100%;
            }
        }

        .group_name {
            opacity: 1;
            transition: all .3s;
        }

        &:hover {
            #wysiwygSummary .ck.ck-toolbar {
                opacity: 1;
                visibility: visible;
            }

            .group_name {
                opacity: 0;
            }
        }
    }
</style>