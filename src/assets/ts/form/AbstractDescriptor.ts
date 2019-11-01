export default abstract class AbstractDescriptor {
    name: string;
    label: (string | undefined) = undefined;
    noLabel: boolean = false;
    faIcon: (string | undefined) = undefined;

    protected constructor(name: string) {
        this.name = name;
    }

    setFaIcon(faIcon: string) {
        this.faIcon = faIcon;
        return this;
    }
}
