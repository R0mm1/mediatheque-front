import {Action, Mutation, VuexModule} from "vuex-module-decorators";
import {
    AuthorEntity,
    BookEntity, FileEntity,
    GroupEntity,
    UserEntity
} from "@/assets/ts/entity/module";
import Xhr from "@/assets/js/xhr";
import BookService from "@/assets/ts/service/BookService";
import FlagService from "@/assets/ts/service/FlagService";
import EntityModuleFlagInterface from "@/assets/ts/store/EntityModuleFlagInterface";
import EventService from "@/assets/ts/service/EventService";
import HistoryService from "@/assets/ts/service/HistoryService";

export abstract class BookModule extends VuexModule {

    static EVENT_BOOK_SAVED = 'book-saved';

    static baseUrl: string = '/api/books';

    protected bookService: BookService = new BookService();

    protected eventService: EventService = EventService.getService();

    historyService: HistoryService = new HistoryService();

    book: BookEntity = this.bookService.getBaseBook();

    tempNewCover: File | null = null; //Can't use undefined instead of null otherwise the attribute won't appear on the state

    flagService: FlagService<EntityModuleFlagInterface> = new FlagService({
        isModified: false,
        readyToSave: true
    });

    referenceGroupsSaving: Promise<any>[] = [];

    protected getBase(id: number, baseUrl: string): Promise<BookEntity> {
        return Xhr.buildGetUrl(baseUrl + '/' + id)
            .then(url => Xhr.fetch(url, {
                method: 'GET'
            }));
    }

    abstract init(): void;

    @Mutation setHistoryService(historyService: HistoryService) {
        this.historyService = historyService;
    }

    @Mutation setBook(book: BookEntity) {
        this.book = book;
    }

    @Mutation setTitle(title: string) {
        this.book.title = title;
    }

    @Mutation setYear(year: string) {
        this.book.year = year;
    }

    @Mutation setPageCount(pageCount: string) {
        this.book.pageCount = parseInt(pageCount);
    }

    @Mutation setIsbn(isbn: string) {
        this.book.isbn = isbn;
    }

    @Mutation setLanguage(language: string) {
        this.book.language = language;
    }

    @Mutation setSummary(summary: string) {
        this.book.summary = summary;
    }

    @Mutation addAuthor(author: AuthorEntity) {
        let authorAtIndex = this.bookService.hasAuthor(this.book, author);
        if (authorAtIndex === false) {
            const authors = Array.from(this.book.authors);
            authors.push(author);
            this.book.authors = authors;
        }
    }

    @Mutation removeAuthor(author: AuthorEntity) {
        let authorAtIndex = this.bookService.hasAuthor(this.book, author);
        if (typeof authorAtIndex === 'number') {
            const authors = Array.from(this.book.authors);
            authors.splice(authorAtIndex, 1);
            this.book.authors = authors;
        }
    }

    @Mutation setOwner(owner: UserEntity | string | number) {
        if (typeof owner === "number") {
            owner = '/api/users/' + owner;
        }
        this.book.owner = owner;
    }

    @Mutation setCover(cover: FileEntity) {
        this.book.cover = cover;
    }

    @Mutation addGroup(group: GroupEntity) {
        this.book.groups.push(group);
    }

    @Mutation unlinkCover() {
        this.book.cover = undefined;
        this.tempNewCover = null;
    }

    @Mutation setTempNewCover(cover: File) {
        this.tempNewCover = cover;
    }

    @Mutation addReferenceGroupSaving(promise: Promise<any>) {
        this.referenceGroupsSaving.push(promise);
    }

    @Action({rawError: true})
    async linkNewCover(file: { file: File, name: string }) {
        this.context.commit('setTempNewCover', file.file);

        this.flagService.flags.readyToSave = false;

        return Xhr.buildGetUrl('/api/book/covers')
            .then(url => Xhr.sendFile(file.file, url))
            .then((response: FileEntity) => {
                this.context.commit('setCover', response);
                this.flagService.flags.readyToSave = true;
                return Promise.resolve(response);
            })
            .catch(response => {
                this.flagService.flags.readyToSave = true;
                return Promise.reject(response);
            });
    }
}
