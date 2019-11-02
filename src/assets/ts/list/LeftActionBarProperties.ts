import LeftActionBarElement from "@/assets/ts/list/LeftActionBarElement";
import LeftActionBarSeparator from "@/assets/ts/list/LeftActionBarSeparator";

export default class LeftActionBarProperties {
    hasAddButton: boolean = true;

    customElements: (LeftActionBarElement | LeftActionBarSeparator)[];

    constructor(customElements: (LeftActionBarElement | LeftActionBarSeparator)[] = []) {
        this.customElements = customElements;
    }
}
