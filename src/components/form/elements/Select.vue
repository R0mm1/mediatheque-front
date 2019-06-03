<template>
    <FormElement :label="label" :name="name" container-custom-classes="form_element_select">
        <template v-slot:element_content>
            <div>
                <div>{{cSelectedLabel}}</div>
                <ul>
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
            optionsSource: {type: [Promise, null], required: true},
            value: {type: [String, Number]}
        },
        data() {
            return {
                selectedValue: undefined,
                options: {}
            };
        },
        methods: {
            setSelectedOption(optionId) {
                this.selectedValue = optionId
                this.$emit('select-changed', optionId, this.options[optionId]);
            }
        },
        computed: {
            cSelectedLabel() {
                return typeof this.selectedValue !== 'undefined' ? this.options[this.selectedValue] : this.defaultText;
            }
        },
        created() {
            this.optionsSource.then(data => {
                this.options = data;
                if (typeof this.options[this.value] !== 'undefined') {
                    this.selectedValue = this.value;
                }
            });
        },
        watch: {
            value(newVal) {
                if (typeof this.options[newVal] !== 'undefined') {
                    this.selectedValue = newVal;
                }
            },
            optionsSource(newVal) {
                newVal.then(data => {
                    this.options = data;
                });
            }
        }
    }
</script>

<style scoped>

</style>