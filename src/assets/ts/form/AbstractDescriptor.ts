export default abstract class AbstractDescriptor {
    descriptorType?: string = undefined;
    name: string;
    label?: string = undefined;
    noLabel: boolean = false;
    faIcon?: string = undefined;

    protected constructor(name: string) {
        this.name = name;
    }

    setFaIcon(faIcon: string) {
        this.faIcon = faIcon;
        return this;
    }
}
