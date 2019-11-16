import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import {BookPaperEntity} from "@/assets/ts/entity/BookPaperEntity";
import BookService from "@/assets/ts/service/BookService";
import {BookModule} from "@/assets/ts/store/book/BookModule";
import Xhr from "@/assets/js/xhr";
import {AuthorEntity} from "@/assets/ts/entity/AuthorEntity";
import {GroupEntity} from "@/assets/ts/entity/GroupEntity";
import store from "@/assets/js/store";
import EntityModuleInterface from "@/assets/ts/store/EntityModuleInterface";
import {BookElectronicEntity} from "@/assets/ts/entity/BookElectronicEntity";

@Module({dynamic: true, name: 'bookPaper', store: store, namespaced: true})
class BookPaperModule extends BookModule implements EntityModuleInterface<BookPaperEntity> {

    protected baseUrl: string = "/api/paper_books/";

    book: BookPaperEntity = this.bookService.getBasePaperBook();

    @Mutation set(book: BookPaperEntity) {
        this.flagService.reset();
        this.book = book;
    }

    @Action
    get(id: Number) {
        return super.getBase(id)
            .then(bookPaper => {
                this.set(bookPaper);
                return this.book;
            });
    }

    @Action
    save(): Promise<boolean> {
        const method = this.bookService.isPersisted(this.book) ? 'PUT' : 'POST';
        const url = '/api/paper_books' + method === 'PUT' ? '/' + this.book.id : '';

        return Xhr.buildGetUrl(url)
            .then(url => {
                //todo: check if authors and groups transformation from array of objects to array of IRI is actually required.
                return Xhr.fetch(url, {
                    method: method,
                    headers: new Headers({'Content-Type': 'application/json'}),
                    body: JSON.stringify({
                        ...this.book,
                        // @ts-ignore
                        authors: this.book.authors.map((author: AuthorEntity) => {
                            return '/api/authors/' + author.id;
                        }),
                        // @ts-ignore
                        groups: this.book.groups.map((group: GroupEntity) => {
                            return '/api/reference_groups/' + group.id;
                        })
                    })
                });
            })
            .then((response: BookPaperEntity) => {
                this.set(response);
                return Promise.resolve(true);
            })
            .catch(() => Promise.resolve(false));
    }
}

export default getModule(BookPaperModule);
