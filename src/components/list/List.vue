<template>

    <span id="vueListContainer">
        <left-action-bar id="vueListLeftActionBar" :hasAddButton="labHasAddButton"
                         :hasDeleteButton="labHasDeleteButton"
                         :customButtons="labCustomButtons"></left-action-bar>
        <div id="vueListContent" ref="vueListContent">
            <table id="vueList" :class="{withPagination: isPaginationEnabled}">
                <thead>
                    <list-header :cols="cols" :colsProperties="colsProperties" :hasRowAction="hasRowAction"
                                 v-on:list-header-sort-up="sortUp"
                                 v-on:list-header-sort-down="sortDown"
                                 v-on:list-header-search="search"/>
                </thead>
                    <tbody>
                        <Row v-for="dataRow in listData" :key="dataRow.id" :dataRow="dataRow" :cols="cols"
                             :rowActions="rowActions"
                             v-on:click.native="$emit('list-action-set', dataRow.id)"></Row>
                    </tbody>
            </table>

            <paginate id="pagination"
                      v-if="isPaginationEnabled"
                      :page-count="paginationPageNumber"
                      :force-page="paginationPosition"
                      :click-handler="setPage"
                      page-class="pagination-item"
                      prev-class="pagination-prev"
                      next-class="pagination-next"
                      prev-text="<i class='fas fa-angle-left'></i>"
                      next-text="<i class='fas fa-angle-right'></i>"
            ></paginate>
        </div>
    </span>

</template>

<script>
    import Row from './Row'
    import ListHeader from './Header'
    import Xhr from './../../assets/js/xhr';
    import LeftActionBar from "./LeftActionBar";
    import Paginate from "vuejs-paginate/src/components/Paginate";
    import PaginationHelper from './../../assets/js/paginationHelper';

    export default {
        data: function () {
            return {
                listData: [],
                sort: {},
                searchParams: {},
                paginationPageNumber: 0,
                paginationPosition: 1,
                paginationRowsPerPage: 30,
                isPaginationEnabled: false
            };
        },
        props: {
            leftActionBarProperties: {
                default: () => ({})
            },
            cols: {},
            colsProperties: {
                default: () => ({})
            },
            apiEndpoint: {},
            rowActions: {
                default: () => ([])
            }
        },
        components: {
            Paginate, LeftActionBar, Row, ListHeader
        },
        computed: {
            labHasAddButton() {
                return (typeof this.leftActionBarProperties.hasAddButton != 'undefined' ? this.leftActionBarProperties.hasAddButton : true);
            },
            labHasDeleteButton() {
                return (typeof this.leftActionBarProperties.hasDeleteButton != 'undefined' ? this.leftActionBarProperties.hasDeleteButton : true);
            },
            labCustomButtons() {
                return (typeof this.leftActionBarProperties.customButtons != 'undefined' ? this.leftActionBarProperties.customButtons : {});
            },
            hasRowAction() {
                return Object.keys(this.rowActions).length > 0;
            }
        },
        methods: {
            load() {
                Xhr.buildGetUrl(this.apiEndpoint, Object.assign(this.searchParams, {
                    order: this.sort,
                    itemsPerPage: this.paginationRowsPerPage,
                    page: this.paginationPosition
                }))
                    .then(url => {
                        return Xhr.fetch(url, {method: 'GET'})
                    })
                    .then(data => {
                        this.listData = data['hydra:member'];

                        PaginationHelper.setRawResponse(data);
                        let isPaginationEnabled = PaginationHelper.hasPagination();
                        if (isPaginationEnabled) {
                            this.paginationPageNumber = PaginationHelper.getPageNumber();
                            this.isPaginationEnabled = true;
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        alert('Une erreur est survenue');
                    });
            },

            setPage(pageNumber) {
                this.paginationPosition = pageNumber;
                this.load();
            },

            sortUp(colName) {
                if (this.sort[colName] && this.sort[colName] === 'ASC') {
                    delete this.sort[colName];
                } else {
                    this.sort[colName] = 'ASC';
                }
                this.load();
            },

            sortDown(colName) {
                if (this.sort[colName] && this.sort[colName] === 'DESC') {
                    delete this.sort[colName];
                } else {
                    this.sort[colName] = 'DESC';
                }
                this.load();
            },

            search(searchParamName, searchValue) {
                if (searchValue === '') {
                    switch (searchParamName) {
                        case 'author':
                            delete this.searchParams[searchParamName + 'firstname'];
                            delete this.searchParams[searchParamName + 'lastname'];
                            break;
                        default:
                            delete this.searchParams[searchParamName];
                    }
                } else {
                    switch (searchParamName) {
                        case 'author':
                            this.searchParams[searchParamName + 'firstname'] = searchValue;
                            this.searchParams[searchParamName + 'lastname'] = searchValue;
                            break;
                        default:
                            this.searchParams[searchParamName] = searchValue;
                    }
                }
                this.load();
            }
        },
        created() {
            this.load();
        },
    }
</script>

<style scoped lang="scss">
    @import "../../assets/scss/colors";

    $leftActionBarWidth: 30px;

    #vueListContainer {
        display: flex;
        height: 100%;
    }

    #vueListLeftActionBar {
        position: fixed;
        display: flex;
        flex-direction: column;
        width: $leftActionBarWidth;
        height: 100%;
        transition: width .3s;
        background-color: #eeeae1;
        z-index: 2;

        &:hover {
            width: 170px;
        }
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

            &.withPagination{
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
        }
    }
</style>

<style lang="scss">
    @import "../../assets/scss/colors";

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
</style>
