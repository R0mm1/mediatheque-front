import {Action, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from "@/assets/js/store";
import Column from "@/assets/ts/list/Column";
import Vue from 'vue';
import Xhr from "@/assets/js/xhr";
import Filter from "@/assets/ts/list/Filter";

@Module({dynamic: true, name: 'list', store: store, namespaced: true})
export default class ListModule extends VuexModule {
    _columns: { [index: string]: Column } = {};

    _paginationRowsPerPage: number = 30;
    _paginationCurrentPage: number = 1;

    _customFilters: Filter[] = [];

    _searchQuery: string = '';


    get columns() {
        return this._columns;
    }

    get searchQuery() {
        return this._searchQuery;
    }

    @Mutation setSearchQuery(searchQuery: string) {
        this._searchQuery = searchQuery;
    }

    @Mutation addColumn(column: Column) {
        this._columns[column.dataField] = column;
    }

    @Mutation handleSortState({dataField, sortState}: { dataField: string, sortState: string }) {
        if (typeof this._columns[dataField] === 'undefined') {
            throw 'Invalid column ' + dataField;
        }

        const column = this._columns[dataField];

        if (sortState === column.sortUp) {
            column.sortState = (column.sortState === column.sortUp) ? column.sortNone : column.sortUp;
        } else if (sortState === column.sortDown) {
            column.sortState = (column.sortState === column.sortDown) ? column.sortNone : column.sortDown;
        }

        Vue.set(this._columns, dataField, column);
    }

    @Mutation setPaginationCurrentPage(currentPage: number) {
        this._paginationCurrentPage = currentPage;
    }

    @Mutation setCustomFilters(customFilters: Filter[]) {
        this._customFilters = customFilters;
    }

    @Action({rawError: true})
    computeSearchString({getFromCache = true, apiEndpoint = ''}: { getFromCache?: boolean, apiEndpoint?: string }) {
        if (getFromCache && this._searchQuery.length > 0) {
            return Promise.resolve(this._searchQuery);
        } else {
            if (apiEndpoint.length === 0) {
                throw "Can't build query string, api endpoint not provided";
            }

            let sort: { [index: string]: string } = {};
            let search: { [index: string]: string } = {};

            Object.keys(this._columns).forEach(dataField => {
                const column = this._columns[dataField];

                if (column.sortState !== column.sortNone) {
                    sort[column.dataField] = column.sortState;
                }

                if (column.searchString.length > 0) {
                    search[column.searchParameterName] = column.searchString;
                }
            });

            const customFilters: { [index: string]: string } = {};
            this._customFilters.forEach(customFilter => {
                customFilters[customFilter.property] = customFilter.value;
            });

            return Xhr.buildGetUrl(apiEndpoint, {
                order: sort,
                itemsPerPage: this._paginationRowsPerPage,
                page: this._paginationCurrentPage,
                ...search,
                ...customFilters
            }).then(url => {
                this.setSearchQuery(url);
                return Promise.resolve(url);
            })
                .catch(error => {
                    console.error(error);
                });
        }
    }
}
