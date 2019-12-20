import {Action, Module, VuexModule, getModule, Mutation} from "vuex-module-decorators";
import store from "@/assets/js/store";
import Xhr from "@/assets/js/xhr";
import {GroupEntity} from "@/assets/ts/entity/GroupEntity";
import {BookEntity} from "@/assets/ts/entity/module";
import EntityService from "@/assets/ts/service/EntityService";

@Module({dynamic: true, name: 'group', store: store, namespaced: true})
class GroupModule extends VuexModule {

    private baseGroup = {
        books: []
    };

    private entityService = new EntityService();

    group: GroupEntity = {...this.baseGroup};

    @Mutation setComment(comment: string) {
        this.group.comment = comment;
    }

    @Mutation addBook(bookIRI: string) {
        this.group.books.push(bookIRI);
    }

    @Mutation init() {
        this.group = {...this.baseGroup};
    }

    @Mutation set(group: GroupEntity) {
        this.group = group;
    }

    @Action({rawError: true}) list(queryArgs: object) {
        return Xhr.buildGetUrl('/api/reference_groups', queryArgs)
            .then(url => Xhr.fetch(url, {
                method: 'GET'
            }));
    }

    @Action save() {
        const method = typeof this.group.id !== 'undefined' ? 'PUT' : 'POST';
        const url = '/api/reference_groups' + (method === 'PUT' ? '/' + this.group.id : '');

        return Xhr.buildGetUrl(url, {})
            .then(url => {
                return Xhr.fetch(url, {
                    method: method,
                    headers: new Headers({'Content-Type': 'application/json'}),
                    body: (() => {
                        const group = this.group;
                        // @ts-ignore
                        group.books = this.group.books.map((book: BookEntity | string) => {
                            return this.entityService.getIri(book);
                        });
                        return JSON.stringify(group);
                    })()
                });
            })
    }
}

export default getModule(GroupModule);
