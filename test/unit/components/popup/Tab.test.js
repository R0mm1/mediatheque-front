import {mount} from '@vue/test-utils'
import Tab from "@/components/popup/Tab.vue";

describe('Tab', () => {
    const wrapper = mount(Tab, {
        slots: {
            tab_content: '<div>Tab content</div>'
        }
    });

    it('renders correctly', () => {
        expect(wrapper.element).toMatchSnapshot();
    })
});
