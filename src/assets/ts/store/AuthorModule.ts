import {Action, Module, Mutation, VuexModule, getModule} from "vuex-module-decorators";
import EntityModuleInterface from "@/assets/ts/store/EntityModuleInterface";
import {AuthorEntity} from "@/assets/ts/entity/AuthorEntity";
import store from "@/assets/js/store";
import FlagService from "@/assets/ts/service/FlagService";
import EntityModuleFlagInterface from "@/assets/ts/store/EntityModuleFlagInterface";
import Xhr from "@/assets/js/xhr";
import EntityModuleService from "@/assets/ts/service/EntityModuleService";

@Module({dynamic: true, name: 'author', store: store, namespaced: true})
class AuthorModule extends VuexModule implements EntityModuleInterface<AuthorEntity> {

    protected baseUrl = "/api/authors";
    protected baseAuthor = {};

    author: AuthorEntity = this.baseAuthor;

    entityModuleService: EntityModuleService = new EntityModuleService();

    flagService = new FlagService<EntityModuleFlagInterface>({
        isModified: false
    });

    @Mutation new() {
        this.author = this.baseAuthor;
        this.flagService.reset();
    }

    @Mutation set(entity: AuthorEntity): void {
        this.author = entity;
    }

    @Mutation setFirstname(firstname: string) {
        ({
            entity: this.author,
            flagService: this.flagService
        } = this.entityModuleService.propertyUpdate<AuthorEntity>(this.author, this.flagService, 'firstname', firstname));
    }

    @Mutation setLastname(lastname: string) {
        console.log(this.entityModuleService.propertyUpdate<AuthorEntity>(this.author, this.flagService, 'lastname', lastname));
        ({
            entity: this.author,
            flagService: this.flagService
        } = this.entityModuleService.propertyUpdate<AuthorEntity>(this.author, this.flagService, 'lastname', lastname));
        console.log(this.author);
    }

    @Action get(id: Number): Promise<AuthorEntity | undefined> {
        return Xhr.buildGetUrl(this.baseUrl + id)
            .then(url => Xhr.fetch(url, {
                method: 'GET'
            }))
            .then(result => {
                this.author = result;
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
