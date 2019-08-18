<template>
    <FormElement :label="label" :name="name" container-custom-classes="form_element_select"
                 label-custom-classes="select_label">
        <template v-slot:element_content>
            <div class="select_content" :class="{select_opened: isOpen}">
                <div class="select_value" v-on:click="toggleOpen">
                    {{cSelectedLabel}}
                    <i class="select_arrow fas fa-caret-down"></i>
                </div>
                <ul class="select_list">
                    <li v-for="(label, value) in options" v-on:click="setSelectedOption(value)" :key="value">
                        {{label}}
                    </li>
                </ul>
            </div>
        </template>
    </FormElement>
</template>

<script>
    import FormElement from "../FormElement";

    export default {
        name: "Select",
        components: {FormElement},
        props: {
            label: {default: '', type: String},
            name: {default: '', type: String},
            defaultText: {default: 'Sélectionnez une valeur', type: String},
            //optionsSource can be either an optionId:optionName object
            //or a method which return an object respecting the formatting above
            //or a method that return a promise which will give an object respecting the formatting above
            optionsSource: {type: [Object, Function], required: true},
            value: {type: [String, Number]}
        },
        data() {
            return {
                isOpen: false,
                selectedValue: undefined,
                options: {}
            };
        },
        methods: {
            setSelectedOption(optionId) {
                this.selectedValue = optionId;
                this.toggleOpen();
                this.$emit('select-changed', optionId, this.options[optionId]);
            },
            reloadOptionsFromSource(source) {
                if (typeof source === 'function') {
                    let returnValue = source();
                    if (returnValue instanceof Promise) {
                        returnValue
                            .then(data => {
                                this.setOptions(data);
                            })
                            .catch(() => {
                                alert('Erreur: la liste des éléments du select n\'a pas pu être chargée');
                            });
                    } else {
                        this.setOptions(returnValue);
                    }
                } else {
                    this.setOptions(source);
                }
            },
            toggleOpen() {
                this.isOpen = !this.isOpen;
            },
            setOptions(newOptions) {
                this.options = newOptions;
                if (typeof this.options[this.value] !== 'undefined') {
                    this.selectedValue = this.value;
                }
            },
            getValue(){
                return this.selectedValue;
            }
        },
        computed: {
            cSelectedLabel() {
                return typeof this.selectedValue !== 'undefined' ? this.options[this.selectedValue] : this.defaultText;
            }
        },
        created() {
            this.reloadOptionsFromSource(this.optionsSource);
        },
        watch: {
            value(newVal) {
                if (typeof this.options[newVal] !== 'undefined') {
                    this.selectedValue = newVal;
                }
            },
            optionsSource(newSource) {
                this.reloadOptionsFromSource(newSource);
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../../assets/scss/colors";

    .select_content {
        position: relative;
    }

    .select_value {
        position: relative;
        padding: 0 2px;
        transition: background-color .3s;
        height: 2rem;
        line-height: 2rem;

        &:hover {
            background-color: $shade4;
        }

        .select_arrow {
            position: absolute;
            right: 5px;
            transition: transform .3s;
            transform: translateY(50%);
        }
    }

    .select_list {
        display: none;
        position: absolute;
        margin: -1px 0 0 0;
        padding: 0;
        list-style-type: none;
        background-color: $shade4;
        box-shadow: 2px 3px 2px $shadow;
        width: 100%;
        z-index: 10;

        li {
            padding: 2px;
            cursor: pointer;

            &:hover {
                background-color: $shade1;
            }
        }
    }

    .select_opened {
        .select_value {
            background-color: $shade4;
            box-shadow: 2px 2px 2px $shadow;

            .select_arrow {
                transform: translateY(50%) rotate(180deg);
            }
        }

        .select_list {
            display: block;
        }
    }
</style>

<style lang="scss">
    .select_label {
        height: 2rem;
        line-height: 2rem;
    }
</style>