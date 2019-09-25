<template>
    <transition name="headerPopup">
        <div class="listHeaderPopup" v-if="isDisplayed">

            <div v-if="column.isSearchable" class="headerPopupSearch">
                <InputText placeholder="Rechercher..." v-model="column.searchString" :no-label="true"></InputText>
                <InputButton :name="'submitSearch_'+column.searchParameterName" labelCustomClasses="fas fa-search"
                             v-on:click.native="search"></InputButton>
            </div>

        </div>
    </transition>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from "vue-property-decorator";
    import Column from "@/assets/ts/list/Column";

    @Component({
        components: {
            InputButton: () => import('@/components/form/elements/InputButton.vue'),
            InputText: () => import('@/components/form/elements/InputText.vue'),
        }
    })
    export default class HeaderPopup extends Vue {
        @Prop(Object) column!: Column;
        @Prop({type: Boolean, default: false}) isDisplayed!: boolean;

        @Emit('list-header-search')
        search() {
            return this.column;
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/scss/colors";

    .headerPopup-enter, .headerPopup-leave-to {
        opacity: 0;
        transform: translateY(-50px);
    }

    .headerPopup-enter-active, .headerPopup-leave-active {
        transition: all .3s;
    }

    .listHeaderPopup {
        position: absolute;
        width: calc(100% - 4px);
        min-width: 250px;
        background-color: $shade1;
        margin-left: -2px;
        z-index: 1;
        padding: 2px;
    }
</style>

<style lang="scss">
    .listHeaderPopup .headerPopupSearch {
        display: flex;

        .form_element_text {
            flex: 1;

            input {
                width: calc(100% - 4px) !important;
                height: calc(100% - 2px) !important;
            }
        }
    }
</style>
