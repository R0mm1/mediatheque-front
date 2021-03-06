import {Mutation, getModule, Action, Module} from "vuex-module-decorators";
import {BookEntity, BookElectronicEntity, FileEntity} from "@/assets/ts/entity/module";
import store from "@/assets/js/store";
import EntityModuleInterface from "@/assets/ts/store/EntityModuleInterface";
import {BookModule} from "@/assets/ts/store/book/BookModule";
import HistoryService from "@/assets/ts/service/HistoryService";
import EntityProxyService from "@/assets/ts/service/EntityProxyService";
import {bookPaperBaseUrl} from "@/assets/ts/store/book/BookPaperModule";
import {container} from 'tsyringe';
import RequestService from "@/assets/ts/service/RequestService";

const requestService = container.resolve(RequestService);

@Module({dynamic: true, name: 'bookElectronic', store: store, namespaced: true})
class BookElectronicModule extends BookModule implements EntityModuleInterface<BookElectronicEntity> {

    static baseUrl: string = "/electronic_books";

    protected proxy: EntityProxyService<BookElectronicEntity> = new EntityProxyService(
        this.flagService, this.historyService
    );

    book: BookElectronicEntity = new Proxy(this.bookService.getBaseElectronicBook(), this.proxy);

    tempNewFile?: File = undefined;

    @Action({rawError: true}) downloadEbook() {
        //todo: better way to avoid TS errors "Property XXX does not exist on type "ThisType<any>"
        // when accessing this.context.state.XXX?
        const state = (this.context.state as { tempNewFile: File });

        let promise = undefined;
        if (typeof this.book.bookFile == 'object' && this.book.bookFile !== null) {
            const request = requestService.createRequest('/book_files/' + this.book.bookFile.id);
            promise = requestService.execute(request)
                .then(response => new Response(response.body))
                .then(response => response.blob())
                .then(blob => URL.createObjectURL(blob));
        } else if (typeof state.tempNewFile !== 'undefined') {
            promise = new Promise(resolve => {
                return resolve(URL.createObjectURL(state.tempNewFile));
            });
        }

        if (typeof promise !== 'undefined') {
            promise
                .then(url => {
                    let a = document.createElement('a');
                    a.href = (url as string);
                    a.download = (this.book.bookFile as FileEntity).path;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
                .catch(error => {
                    console.error(error);
                    alert('Impossible de télécharger le fichier');
                });
        }
    }

    @Action({rawError: true}) get(id: number): Promise<BookElectronicEntity | undefined> {
        this.historyService.init();
        return super.getBase(id, BookElectronicModule.baseUrl)
            .then((book: BookEntity) => {
                const electronicBook = {
                    hasBookFile: (typeof book.bookFile === 'object'),
                    ...book
                };
                this.set(electronicBook);
                return this.book;
            });
    }

    @Action({rawError: true}) save(bookTypeChanged: boolean = false): Promise<any> {
        const method = this.bookService.isPersisted(this.book) ? 'PUT' : 'POST';
        const url = (bookTypeChanged ? bookPaperBaseUrl : BookElectronicModule.baseUrl)
            + (method === 'PUT' ? ('/' + this.book.id) : '');
        const request = requestService.createRequest(url, method)
            .setBody(this.bookService.prepareForUpload(this.book))
            .addHeader('Content-Type', 'application/json');

        return requestService.execute(request)
            .then((response: BookElectronicEntity) => {
                response.authors = this.book.authors;
                this.set(response);

                this.eventService.trigger(BookElectronicModule.EVENT_BOOK_SAVED);
            });
    }

    @Mutation set(book: BookElectronicEntity, historyService?: HistoryService) {
        this.flagService.reset();
        this.historyService.init();
        this.book = new Proxy(book, this.proxy);
    }

    @Mutation unlinkBookFile() {
        this.historyService.addEntry('bookFile', undefined, this.book.bookFile);
        this.book.bookFile = undefined;
        this.book.hasBookFile = false;
        this.flagService.flags.isModified = true;
    }

    @Mutation setTempNewFile(bookFile: File) {
        this.tempNewFile = bookFile;
    }

    @Mutation setBookFile(bookFile: FileEntity) {
        this.book.bookFile = bookFile;
    }

    @Mutation init(): void {
        super.init();
        this.flagService.reset();
        this.historyService.init();
        this.book = new Proxy(this.bookService.getBaseElectronicBook(), this.proxy);
    }

    @Mutation setHistoryService(historyService: HistoryService) {
        super.setHistoryService(historyService);
        this.proxy.historyService = historyService;
    }

    @Action({rawError: true}) linkNewFile(file: { file: File, name: string }) {
        this.context.commit('setTempNewFile', file.file);

        this.flagService.flags.readyToSave = false;

        return requestService.sendFile(file.file, '/book_files')
            .then((response: any) => {
                this.context.commit('setBookFile', response);
                this.flagService.flags.readyToSave = true;
                return Promise.resolve(response);
            })
            .catch((response: any) => {
                this.flagService.flags.readyToSave = true;
                return Promise.reject(response);
            });
    }
}

export default getModule(BookElectronicModule);
export const bookElectronicBaseUrl = BookElectronicModule.baseUrl;
