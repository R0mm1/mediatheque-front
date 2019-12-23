import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import {BookPaperEntity} from "@/assets/ts/entity/BookPaperEntity";
import {BookModule} from "@/assets/ts/store/book/BookModule";
import Xhr from "@/assets/js/xhr";
import store from "@/assets/js/store";
import EntityModuleInterface from "@/assets/ts/store/EntityModuleInterface";
import EntityProxyService from "@/assets/ts/service/EntityProxyService";
import HistoryService from "@/assets/ts/service/HistoryService";
import {bookElectronicBaseUrl} from "@/assets/ts/store/book/BookElectronicModule";

@Module({dynamic: true, name: 'bookPaper', store: store, namespaced: true})
class BookPaperModule extends BookModule implements EntityModuleInterface<BookPaperEntity> {

    static baseUrl: string = "/api/paper_books";

    book: BookPaperEntity = this.bookService.getBasePaperBook();

    protected proxy: EntityProxyService<BookPaperEntity> = new EntityProxyService(
        this.flagService, this.historyService
    );

    @Mutation set(book: BookPaperEntity) {
        this.flagService.reset();
        this.historyService.init();
        this.book = new Proxy(book, this.proxy);
    }

    @Mutation init(): void {
        this.flagService.reset();
        this.historyService.init();
        this.book = new Proxy(this.bookService.getBasePaperBook(), this.proxy);
    }

    @Mutation setHistoryService(historyService: HistoryService) {
        super.setHistoryService(historyService);
        this.proxy.historyService = historyService;
    }

    @Action({rawError: true}) get(id: number) {
        this.historyService.init();
        return super.getBase(id, BookPaperModule.baseUrl)
            .then(bookPaper => {
                this.set(bookPaper);
                return this.book;
            });
    }

    @Action({rawError: true}) save(bookTypeChanged: boolean = false): Promise<any> {
        const method = this.bookService.isPersisted(this.book) ? 'PUT' : 'POST';
        const url = (bookTypeChanged ? bookElectronicBaseUrl : BookPaperModule.baseUrl)
            + (method === 'PUT' ? ('/' + this.book.id) : '');

        return Xhr.buildGetUrl(url)
            .then(url => {
                return Xhr.fetch(url, {
                    method: method,
                    headers: new Headers({'Content-Type': 'application/json'}),
                    body: this.bookService.prepareForUpload(this.book)
                });
            })
            .then((response: BookPaperEntity) => {
                response.authors = this.book.authors;
                this.set(response);

                this.eventService.trigger(BookPaperModule.EVENT_BOOK_SAVED);

                return Promise.all(this.referenceGroupsSaving);
            });
    }
}

export default getModule(BookPaperModule);
export const bookPaperBaseUrl = BookPaperModule.baseUrl;
