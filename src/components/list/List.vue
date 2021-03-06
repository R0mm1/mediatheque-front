<template>

    <span id="vueListContainer">

        <left-action-bar :leftActionBarProperties="leftActionBarProperties"></left-action-bar>

        <div id="vueListContent" ref="vueListContent">

            <table id="vueList" :class="{withPagination: isPaginationEnabled}">
                <thead>
                    <list-header :cols="cols" :hasRowAction="hasRowAction"
                                 v-on:list-header-sort-up="queryParamsChanged"
                                 v-on:list-header-sort-down="queryParamsChanged"
                                 v-on:list-header-search="queryParamsChanged"/>
                </thead>
                <tbody>
                    <template v-if="!isLoading">
                        <Row v-for="dataRow in listData" :key="dataRow.id" :dataRow="dataRow" :cols="cols"
                             :rowActions="rowActions" v-on:click.native="$emit('list-action-set', dataRow)"></Row>
                    </template>
                    <template v-else>
                        <Loader class="list-loader"></Loader>
                    </template>
                </tbody>
            </table>

            <paginate id="pagination"
                      v-if="isPaginationEnabled"
                      :page-count="paginationTotalPages"
                      :force-page="paginationCurrentPage"
                      :click-handler="setPage"
                      page-class="pagination-item"
                      prev-class="pagination-prev"
                      next-class="pagination-next"
                      prev-text="<i class='fas fa-angle-left'></i>"
                      next-text="<i class='fas fa-angle-right'></i>"/>
        </div>
    </span>

</template>

<script lang="ts">

    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import {getModule} from "vuex-module-decorators";

    import Column from "@/assets/ts/list/Column";
    import RowAction from "@/assets/ts/list/RowAction";
    import LeftActionBarProperties from '@/assets/ts/list/LeftActionBarProperties';
    import PaginationHelper from "@/assets/js/paginationHelper";
    import Filter from "@/assets/ts/list/Filter";

    import ListModule from '@/assets/ts/store/ListModule';

    import {container} from 'tsyringe';
    import RequestService from "@/assets/ts/service/RequestService";

    const requestService = container.resolve(RequestService);
    const listModule = getModule(ListModule);

    @Component({
        components: {
            Row: () => import('@/components/list/Row.vue'),
            ListHeader: () => import('@/components/list/Header.vue'),
            LeftActionBar: () => import('@/components/list/LeftActionBar.vue'),
            Paginate: () => import('vuejs-paginate/src/components/Paginate.vue'),
            Loader: () => import('@/components/widgets/Loader.vue')
        }
    })
    export default class List extends Vue {
        listData: {}[] = [];
        isPaginationEnabled: boolean = false;
        paginationTotalPages?: Number;
        isLoading: boolean = true;

        @Prop(Array) cols!: Column[];
        @Prop(String) apiEndpoint!: string;

        @Prop({type: Object, default: () => new LeftActionBarProperties()})
        leftActionBarProperties!: LeftActionBarProperties;
        @Prop({type: Array, default: () => []})
        rowActions!: RowAction[];
        @Prop({type: Array, default: () => []})
        customFilters!: Filter[];

        get hasRowAction() {
            return this.rowActions.length > 0;
        }

        get paginationCurrentPage() {
            return listModule._paginationCurrentPage;
        }

        queryParamsChanged() {
            this.load(false, true);
        }

        load(fromCache: boolean = true, resetPagination: boolean = false) {
            this.isLoading = true;

            if (resetPagination)
                listModule.setPaginationCurrentPage(1);

            listModule.computeSearchString({getFromCache: fromCache, apiEndpoint: this.apiEndpoint})
                .then(() => {
                    return requestService.execute(
                        requestService.createRequest(listModule.searchQuery).setSkipUrlBuilding(true)
                    );
                })
                .then((data: { [index: string]: any }) => {
                    this.listData = data['hydra:member'];
                    PaginationHelper.setRawResponse(data);
                    this.isPaginationEnabled = PaginationHelper.hasPagination();
                    if (this.isPaginationEnabled) {
                        this.paginationTotalPages = PaginationHelper.getPageNumber();
                    }
                    this.isLoading = false;
                })
                .catch(error => {
                    console.error(error);
                });
        }

        setPage(pageNumber: number) {
            listModule.setPaginationCurrentPage(pageNumber);
            this.load(false);
        }

        @Watch('customFilters')
        onCustomFiltersChanged() {
            listModule.setCustomFilters(this.customFilters);
            this.load(false, true);
        }

        created() {
            this.cols.forEach((col: Column) => {
                listModule.addColumn(col);
            });
            listModule.setCustomFilters(this.customFilters);
            this.load(false);
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/scss/colors";

    $leftActionBarWidth: 30px;

    #vueListContainer {
        display: flex;
        height: 100%;
    }

    #vueListContent {
        flex-grow: 1;
        overflow: hidden;
        margin-left: $leftActionBarWidth;
        display: flex;
        flex-direction: column;

        #vueList {
            display: block;
            border-collapse: collapse;
            width: 100%;
            height: 100%;
            transition: all .3s;

            &.withPagination {
                height: calc(100% - 2rem) !important;
            }

            thead {
                display: table;
                width: 100%;
                table-layout: fixed;
            }

            tbody tr {
                display: table;
                width: 100%;
                table-layout: fixed;
            }

            tbody {
                display: block;
                height: calc(100% - 34px);
                overflow: auto;
            }

            td.cell {
                padding: 5px 3px 5px 5px;
            }

            tr:not(.listListHeader):nth-child(2n) {
                background-color: #fcfcfa;
            }

            .list-loader {
                margin: 0 auto;
                display: flex;
            }
        }
    }
</style>

<style lang="scss">
    @import "../../assets/scss/colors";

    $leftActionBarWidth: 30px;

    #pagination {
        margin: 0;
        padding: 0;
        list-style-type: none;
        height: 2rem;
        background-color: $shade2;

        .pagination-item, .pagination-prev, .pagination-next {
            display: inline-block;
            line-height: calc(2rem - 10px);
            padding: 0 3px;
            margin: 5px 3px;
            border-bottom: 2px solid $shade1;
            transition: all .3s;

            &:hover, &.active {
                border-bottom: 2px solid $shade1;
                background-color: $shade1;
                color: white;
            }
        }
    }

    #leftActionBar {
        position: fixed;
        display: flex;
        flex-direction: column;
        width: $leftActionBarWidth;
        height: 100%;
        transition: width .3s;
        background-color: #eeeae1;
        z-index: 10;

        &:hover {
            width: 170px;
        }
    }
</style>
