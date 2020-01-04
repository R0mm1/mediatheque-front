import {mount} from '@vue/test-utils'
import TopButtonBar, {TopButtonBarElement} from "@/components/popup/TopButtonBar.vue";

describe('TopButtonBar', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(TopButtonBar, {
            sync: false,
            propsData: {
                buttons: [
                    new TopButtonBarElement('fas fa-book', 'main'),
                    new TopButtonBarElement('fas fa-comment', 'social')
                ],
                defaultTab: 'main'
            }
        })
    });

    it('renders correctly', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('renders correctly after tab changed', async () => {
        wrapper.find('.form_element_button.social').trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.element).toMatchSnapshot();
    });
});
