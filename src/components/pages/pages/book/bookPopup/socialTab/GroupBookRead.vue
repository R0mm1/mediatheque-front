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

    const config = require('../../../../../../../mediatheque');

    export default {
        name: "GroupBookRead",
        components: {Loader, Group, VueStars},
        props: {bookStore: {type: Object, required: true}},
        data() {
            return {
                isNotationLoading: true,
                note: 0
            };
        },
        computed: {
            cNote: {
                get() {
                    return this.note;
                },
                set(value) {
                    this.isNotationLoading = true;
                    this.bookStore.updateNote(value)
                        .then(bookNotation => {
                            this.note = bookNotation.note;
                            this.isNotationLoading = false;
                        })
                        .catch(error => {
                            this.$toasted.show("Une erreur est survenue lors de l'enregistrement de la note", {
                                ...config.default.notification_settings,
                                type: 'error',
                                icon: 'fa-times',
                            });
                            console.error(error);
                            this.isNotationLoading = false;
                        })
                }
            }
        },
        created() {
            this.bookStore.getNotation()
                .then(notation => {
                    if (notation !== null) {
                        this.note = notation.note;
                    }
                    this.isNotationLoading = false;
                })
                .catch(error => {
                    this.$toasted.show('Une erreur est survenue lors du chargement de la note', {
                        ...config.default.notification_settings,
                        type: 'error',
                        icon: 'fa-times',
                    });
                    console.error(error);
                    this.isNotationLoading = false;
                });
        }
    }
</script>

<style scoped>

</style>
