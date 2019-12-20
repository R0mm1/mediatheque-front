<template>
    <Group>
        <template v-slot:group_name>
            J'ai lu ce livre
        </template>
        <template v-slot:group_content>
            <Loader v-if="isNotationLoading"></Loader>
            <VueStars :max="10" v-if="!isNotationLoading" v-model="cNote">
                <template v-slot:activeLabel><i class="fas fa-star"></i></template>
                <template v-slot:inactiveLabel><i class="far fa-star"></i></template>
            </VueStars>
        </template>
    </Group>
</template>

<script>
    import {VueStars} from "vue-stars"

    import Group from "../../../../../popup/Group";
    import Loader from "../../../../../widgets/Loader";

    import store from "../../../../../../assets/js/store";
    import BookNotationModule from "../../../../../../assets/js/store/bookNotation";
    import BookModule from "../../../../../../assets/js/store/book";

    if (!store.state['bookNotation']) {
        store.registerModule('bookNotation', BookNotationModule);
    }

    if (!store.state['book']) {
        store.registerModule('book', BookModule);
    }

    export default {
        name: "GroupBookRead",
        components: {Loader, Group, VueStars},
        data() {
            return {
                isNotationLoading: true
            };
        },
        computed: {
            cNote: {
                get() {
                    return this.$store.getters['bookNotation/getProperty']('note');
                },
                set(value) {
                    this.$store.commit('bookNotation/setProperty', {
                        property: 'note',
                        value: value
                    });
                    this.$store.dispatch('bookNotation/save');
                }
            }
        },
        created() {
            const bookId = this.$store.getters['book/getProperty']('id');
            this.$store.dispatch('bookNotation/findByBook', bookId)
                .then(() => {
                    const bookNotationId = this.$store.getters['bookNotation/getProperty']('id');
                    if (bookNotationId === null) {
                        this.$store.commit('bookNotation/create', {
                            bookId: bookId,
                            note: 0
                        });
                    }
                    this.isNotationLoading = false;
                })
                .catch(response => {
                    console.error(response);
                });
        },
        store
    }
</script>

<style scoped>

</style>
