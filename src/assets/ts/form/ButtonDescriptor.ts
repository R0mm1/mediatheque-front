import AbstractDescriptor from "@/assets/ts/form/AbstractDescriptor";

export type ButtonStyle = 'normal' | 'negative';
export type ButtonRoundedCorner = Boolean | Number; //Number to specify the value to use in CSS, true to use default value, false to deactivate

export default class ButtonDescriptor extends AbstractDescriptor {
    readonly type_button = 'button';
    readonly type_submit = 'submit';

    descriptorType = 'ButtonDescriptor';
    type: string = this.type_button;
    value: string = '';
    disabled: boolean = false;
    customClasses: string[] = [];
    labelCustomClasses: string[] = [];
    style: ButtonStyle = 'normal';
    roundedCorner: ButtonRoundedCorner = false;

    isIconButton: Boolean = false;
    iconButtonDimension: Number = 24;

    buttonWidth?: Number;
    buttonHeight?: Number;

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

    setStyle(style: ButtonStyle) {
        this.style = style;
        return this;
    }

    addCustomClass(customClass: string) {
        this.customClasses.push(customClass);
        return this;
    }

    setRoundedCorner(roundedCorner: ButtonRoundedCorner) {
        this.roundedCorner = roundedCorner;
        return this;
    }

    setIsIconButon(isIconButton: boolean, iconButtonDimension?: Number) {
        this.isIconButton = isIconButton;
        if (typeof iconButtonDimension !== 'undefined') {
            this.iconButtonDimension = iconButtonDimension;
        }
        return this;
    }

    setButtonDimensions(height?: Number, width?: Number) {
        if (typeof height !== 'undefined') {
            this.buttonHeight = height;
        }
        if (typeof width !== 'undefined') {
            this.buttonWidth = width;
        }
        return this;
    }
}
