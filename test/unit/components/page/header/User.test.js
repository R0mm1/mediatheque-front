import {mount} from '@vue/test-utils'
import User from "@/components/pages/header/User.vue";

describe('User', () => {
    const wrapper = mount(User);

    it('renders correctly', () => {
        expect(wrapper.element).toMatchSnapshot();
    })
});
