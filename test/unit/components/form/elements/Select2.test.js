import {createLocalVue, mount} from '@vue/test-utils'
import Select2 from "@/components/form/elements/Select2.vue"
import SelectDescriptor from "../../../../../src/assets/ts/form/SelectDescriptor";
import Vuetify from "vuetify";
import Vue from 'vue';

Vue.use(Vuetify);

describe('Select2', () => {

    const configBase = {
        created() {
            this.$vuetify.lang = {
                t: () => {
                },
            };
            this.$vuetify.theme = {dark: false};
        }
    };

    it('renders correctly', () => {
        const wrapper = mount(Select2, {
            // localVue: localVue,
            propsData: {
                'selectDescriptor': new SelectDescriptor('my-select', {
                    'option1': 'My first option',
                    'option2': 'My second option'
                }, 'This is an awesome select').setValue('option1'),
                'searchable': true,
                'value': 'option2'
            },
            ...configBase
        });
        expect(wrapper.element).toMatchSnapshot();
    });
});
