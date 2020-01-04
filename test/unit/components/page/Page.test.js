import {mount} from '@vue/test-utils'
import Page from "@/components/pages/Page.vue";

describe('Page', () => {

    const factory = (withCustomHeader) => {
        if (typeof withCustomHeader === 'undefined') withCustomHeader = false;

        const slots = {
            med_page_body: '<div>Page Body</div>',
            med_page_footer: '<div>Page Footer</div>'
        };

        if (withCustomHeader) {
            slots.med_page_header = '<div>Page Header</div>';
        }

        return mount(Page, {
            slots: slots
        });
    };

    it('renders correctly with custom header', () => {
        expect(factory(true).element).toMatchSnapshot();
    });

    it('renders correctly with Header', () => {
        expect(factory(false).element).toMatchSnapshot();
    });
});
