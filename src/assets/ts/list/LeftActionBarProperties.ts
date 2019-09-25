import LeftActionBarButton from "@/assets/ts/list/LeftActionBarButton";

export default class LeftActionBarProperties {
    hasAddButton: boolean = true;

    customButtons: LeftActionBarButton[];

    constructor(customButtons: LeftActionBarButton[] = []) {
        this.customButtons = customButtons;
    }
}
