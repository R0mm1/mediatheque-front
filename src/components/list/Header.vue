<template>
    <tr class="listListHeader">
        <th v-for="(colDataAttribute, colName) in cols" class="cell">
            <div class="headerRow headerRow1">
                <div class="headerRowLabel">{{colName}}</div>
                <button v-if="isSearchEnabled(colName)"
                        class="headerSearchButton fas fa-ellipsis-h"
                        v-on:click="toggleRowTwo(colDataAttribute)"></button>
                <div v-if="isSortEnabled(colName)" class="buttonGroup">
                    <button class="headerSortButtonUp fas fa-sort-up"
                            v-on:click="$emit('list-header-sort-up', colDataAttribute)"></button>
                    <button class="headerSortButtonDown fas fa-sort-down"
                            v-on:click="$emit('list-header-sort-down', colDataAttribute)"></button>
                </div>
            </div>
            <div class="headerRow headerRow2 headerRowFloating" v-if="isSearchEnabled(colName)"
                 :class="{headerRowHidden: !listDisplayRowTwo[colDataAttribute]}">
                <div class="headerRowContent">
                    <inputText :ref="'search_'+getSearchName(colName)" :placeholder="'Rechercher...'"></inputText>
                    <button :name="'submitSearch_'+getSearchName(colName)"
                            v-on:click="search"
                            class="fas fa-search"></button>
                </div>
            </div>
        </th>

        <th v-if="hasRowAction"></th>
    </tr>
</template>

<script>
    import InputText from '../form/elements/InputText';

    export default {
        name: 'Header',
        components: {InputText},
        props: ['cols', 'colsProperties', 'hasRowAction'],
        data() {
            return {
                listDisplayRowTwo: {}
            }
        },
        methods: {
            isSearchEnabled: function (colName) {
                return !this.colsProperties[colName]
                    || (typeof this.colsProperties[colName]['search'] === 'undefined')
                    || this.colsProperties[colName]['search'] === true;
            },
            isSortEnabled: function (colName) {
                return !this.colsProperties[colName]
                    || (typeof this.colsProperties[colName]['sort'] === 'undefined')
                    || this.colsProperties[colName]['sort'] === true;
            },
            getSearchName: function (colName) {
                if (this.colsProperties[colName] && this.colsProperties[colName]['searchName']) {
                    return this.colsProperties[colName]['searchName'];
                } else {
                    return this.cols[colName];
                }
            },
            toggleRowTwo: function (colDataAttribute) {
                if (!this.listDisplayRowTwo[colDataAttribute]) {
                    this.$set(this.listDisplayRowTwo, colDataAttribute, true);
                } else {
                    this.$set(this.listDisplayRowTwo, colDataAttribute, !this.listDisplayRowTwo[colDataAttribute]);
                }
            },
            search: function (e) {
                let searchParamName = e.target.name.split("submitSearch_")[1];
                let searchValue = this.$refs['search_' + searchParamName][0].getValue();
                this.$emit('list-header-search', searchParamName, searchValue);
            }
        }
    }
</script>

<style lang="scss">
    @import "../../assets/scss/colors";

    .listListHeader {
        background-color: $shade1;


        .cell {
            height: 2rem;
            position: relative;
        }

        .headerRow {
            &.headerRowHidden {
                .headerRowContent {
                    margin-top: -55px !important;
                }
            }

            &.headerRowFloating {
                overflow: hidden;
                position: absolute;
                right: 0;

                .headerRowContent {
                    transition: all .3s;
                    display: flex;
                    border: 1px solid $shade1;
                    background-color: $shade4;
                    padding: 5px;
                    margin-top: 5px;
                }
            }

            button {
                border: none;
                background: $shade4;
                transition: background-color .3s, color .3s;

                &:hover {
                    background: #bbaf99;
                    color: white;
                }
            }

            > button {
                padding: 5px;
            }
        }

        .headerRow1 {
            display: flex;
            height: 100%;
            border-right: 1px solid #d0c3a9;

            .headerRowLabel {
                flex-grow: 1;
                margin: auto;
            }

            .buttonGroup {
                height: 100%;
                border-radius: 0px 5px 0px 0px;
                overflow: hidden;

                > button {
                    display: block;
                    height: 50%;
                }
            }
        }

        .headerRow2 {
            width: 100%;

            .form_element input {
                margin-bottom: initial !important;
                height: 19px;
            }
        }
    }
</style>