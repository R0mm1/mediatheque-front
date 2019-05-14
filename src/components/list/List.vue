<template>

    <span id="vueListContainer">
        <left-action-bar id="vueListLeftActionBar" :hasAddButton="labHasAddButton"
                         :hasDeleteButton="labHasDeleteButton"
                         :customButtons="labCustomButtons"></left-action-bar>
        <div id="vueListContent">
            <table id="vueList">
                <thead>
                    <list-header :cols="cols" :colsProperties="colsProperties" :hasRowAction="hasRowAction"
                                 v-on:list-header-sort-up="sortUp"
                                 v-on:list-header-sort-down="sortDown"
                                 v-on:list-header-search="search"/>
                </thead>
                <tbody>
                    <Row v-for="dataRow in listData" :key="dataRow.id" :dataRow="dataRow" :cols="cols"
                         :rowActions="rowActions" v-on:click.native="$emit('list-action-set', dataRow.id)"></Row>
                </tbody>
            </table>
        </div>
    </span>

</template>

<script>
    import Row from './Row'
    import ListHeader from './Header'
    import Xhr from './../../assets/js/xhr';
    import LeftActionBar from "./LeftActionBar";

    export default {
        data: function () {
            return {
                listData: [],
                sort: {},
                searchParams: {}
            };
        },
        props: {
            leftActionBarProperties: {
                default: () => ({})
            },
            cols: {},
            colsProperties: {},
            apiEndpoint: {},
            rowActions: {
                default: () => ([])
            }
        },
        components: {
            LeftActionBar, Row, ListHeader
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
            load: function () {
                Xhr.buildGetUrl(this.apiEndpoint, Object.assign(this.searchParams, {order: this.sort}))
                    .then(url => {
                        return Xhr.fetch(url, {method: 'GET'})
                    })
                    .then(data => this.listData = data['hydra:member'])
                    .catch(error => {
                        console.error(error);
                        alert('Une erreur est survenue');
                    });
            },

            sortUp: function (colName) {
                if (this.sort[colName] && this.sort[colName] === 'ASC') {
                    delete this.sort[colName];
                } else {
                    this.sort[colName] = 'ASC';
                }
                this.load();
            },

            sortDown: function (colName) {
                if (this.sort[colName] && this.sort[colName] === 'DESC') {
                    delete this.sort[colName];
                } else {
                    this.sort[colName] = 'DESC';
                }
                this.load();
            },

            search: function (searchParamName, searchValue) {
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
        created: function () {
            this.load();
        },
    }
</script>

<style scoped lang="scss">
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

        #vueList {
            display: block;
            border-collapse: collapse;
            width: 100%;
            height: 100%;

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