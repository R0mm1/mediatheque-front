import {Action, Module, Mutation, VuexModule, getModule} from "vuex-module-decorators";
import EntityModuleInterface from "@/assets/ts/store/EntityModuleInterface";
import {AuthorEntity} from "@/assets/ts/entity/AuthorEntity";
import store from "@/assets/js/store";
import FlagService from "@/assets/ts/service/FlagService";
import EntityModuleFlagInterface from "@/assets/ts/store/EntityModuleFlagInterface";
import Xhr from "@/assets/js/xhr";
import EntityProxyService from "@/assets/ts/service/EntityProxyService";
import HistoryService from "@/assets/ts/service/HistoryService";

@Module({dynamic: true, name: 'author', store: store, namespaced: true})
class AuthorModule extends VuexModule implements EntityModuleInterface<AuthorEntity> {

    protected baseUrl = "/api/authors";
    protected baseAuthor = {};

    author: AuthorEntity = this.baseAuthor;

    flagService = new FlagService<EntityModuleFlagInterface>({
        isModified: false,
        readyToSave: true
    });

    proxy = new EntityProxyService(this.flagService, new HistoryService());

    @Mutation new() {
        this.author = new Proxy(this.baseAuthor, this.proxy);
        this.flagService.reset();
    }

    @Mutation set(entity: AuthorEntity): void {
        this.author = new Proxy(entity, this.proxy);
    }

    @Mutation setFirstname(firstname: string) {
        this.author.firstname = firstname;
    }

    @Mutation setLastname(lastname: string) {
        this.author.lastname = lastname;
    }

    @Action({rawError: true}) get(id: number): Promise<AuthorEntity | undefined> {
        return Xhr.buildGetUrl(this.baseUrl + '/' + id)
            .then(url => Xhr.fetch(url, {
                method: 'GET'
            }))
            .then(result => {
                this.set(result);
                return Promise.resolve(this.author);
            });
    }

    @Action save(): Promise<AuthorEntity | boolean> {
        const method = typeof this.author.id === 'undefined' ? 'POST' : 'PUT';
        const url = this.baseUrl + (method === 'PUT' ? '/' + this.author.id : '');

        return Xhr.buildGetUrl(url)
            .then(url => Xhr.fetch(url, {
                method: method,
                headers: new Headers({'Content-Type': 'application/json'}),
                body: JSON.stringify(this.author)
            }))
            .then((author: AuthorEntity) => {
                this.set(author);
                return Promise.resolve(author);
            })
            .catch(error => {
                console.error(error);
                return Promise.resolve(false);
            });
    }

}

export default getModule(AuthorModule);
