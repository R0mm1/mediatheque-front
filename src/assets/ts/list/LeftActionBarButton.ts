export default class LeftActionBarButton {
    icon!: string;
    label!: string;
    callback!: Function;

    constructor(icon: string, label: string, callback: Function) {
        this.icon = icon;
        this.label = label;
        this.callback = callback;
    }
}
