import {mount} from '@vue/test-utils'
import Popup from "@/components/popup/Popup.vue";

describe('Popup', () => {
    const wrapper = mount(Popup, {
        propsData: {
            loaded: false
        },
        slots: {
            popup_header: '<div>This is the header</div>',
            popup_body: '<div>This is the body</div>',
            popup_footer: '<div>This is the footer</div>'
        }
    });

    it('renders correctly when not loaded', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('renders correctly when loaded', () => {
        wrapper.setProps({
            loaded: true
        });
        expect(wrapper.element).toMatchSnapshot();
    })
});
