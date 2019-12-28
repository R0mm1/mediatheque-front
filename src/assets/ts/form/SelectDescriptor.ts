import AbstractDescriptor from "@/assets/ts/form/AbstractDescriptor";

export default class SelectDescriptor extends AbstractDescriptor {
    static defaultSearchable: boolean = false;

    descriptorType: string = 'SelectDescriptor';
    value: (undefined | string | null) = undefined;
    placeholder: string = '';
    options: { [index: string]: string };
    searchable: boolean = SelectDescriptor.defaultSearchable;

    constructor(name: string, options: { [index: string]: string }, label: string = '') {
        super(name);

        this.label = label;
        this.options = options;
    }

    getOptionsAsObjects(itemLabel: string = 'text', itemValue: string = 'value'): Object[] {
        let options: Object[] = [];
        Object.keys(this.options).forEach(optionName => {
            let option: any = {};
            option[itemLabel] = this.options[optionName];
            option[itemValue] = optionName;
            options.push(option);
        });
        return options;
    }

    setValue(value: string) {
        this.value = value;
        return this;
    }

    setPlaceholder(placeholder: string) {
        this.placeholder = placeholder;
        return this;
    }
}
