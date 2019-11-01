import AbstractDescriptor from "@/assets/ts/form/AbstractDescriptor";

export default class ButtonDescriptor extends AbstractDescriptor{
    readonly type_button = 'button';
    readonly type_submit = 'submit';

    type: string = this.type_button;
    value: string = '';
    disabled: boolean = false;
    customClasses: string[] = [];
    labelCustomClasses: string[] = [];

    constructor(name: string, value?: string, type?: string) {
        super(name);

        if (typeof value !== 'undefined') this.value = value;

        if (typeof type !== 'undefined') {
            if (type !== this.type_button && type !== this.type_submit) {
                throw "Invalid type " + type + " provided";
            }
            this.type = type;
        }
    }
}
