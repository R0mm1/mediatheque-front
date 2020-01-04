import {mount} from '@vue/test-utils'
import Group from "@/components/popup/Group.vue";

describe('Group', () => {
    const wrapper = mount(Group, {
        slots: {
            'group_name': '<div>Slot group_name</div>',
            'group_customActions': '<div>Slot group_customActions</div>',
            'group_content': '<div>Slot group_content</div>'
        }
    });

    it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
