import {mount} from '@vue/test-utils'
import Menu from "@/components/pages/header/Menu.vue"

describe('Menu', ()=>{
    const wrapper = mount(Menu);

    it('renders correctly', ()=>{
        expect(wrapper.element).toMatchSnapshot();
    });
});
