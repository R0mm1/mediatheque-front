import {mount} from '@vue/test-utils'
import Header from "@/components/pages/Header.vue";

describe('Header', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Header, {
            propsData: {
                customHeaderMessage: 'This is the header'
            }
        })
    });

    it('renders correctly with user', function () {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly without user', () => {
        wrapper.setProps({
            noUser: true
        });
        expect(wrapper).toMatchSnapshot();
    })
});
