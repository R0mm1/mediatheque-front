export default class EntityService {
    getIri(value: any): string | undefined {
        if (typeof value === 'string') {
            return value;
        } else if (typeof value === 'object') {
            return value['@id'];
        } else {
            return undefined;
        }
    }
}
