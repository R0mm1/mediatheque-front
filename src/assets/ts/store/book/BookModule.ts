import {Mutation, VuexModule} from "vuex-module-decorators";
import {
    AuthorEntity,
    BookEntity,
    GroupEntity,
    UserEntity
} from "@/assets/ts/entity/module";
import Xhr from "@/assets/js/xhr";
import BookService from "@/assets/ts/service/BookService";
import FlagService from "@/assets/ts/service/FlagService";
import EntityModuleFlagInterface from "@/assets/ts/store/EntityModuleFlagInterface";
import EntityModuleService from "@/assets/ts/service/EntityModuleService";

export abstract class BookModule extends VuexModule {

    protected baseUrl: string = '/api/books/';

    bookService: BookService = new BookService();

    entityModuleService: EntityModuleService = new EntityModuleService();

    book: BookEntity = this.bookService.getBaseBook();

    flagService: FlagService<EntityModuleFlagInterface> = new FlagService({
        isModified: false
    });

    @Mutation setBook(book: BookEntity) {
        this.book = book;
    }

    protected getBase(id: Number): Promise<BookEntity> {
        return Xhr.buildGetUrl(this.baseUrl + id)
            .then(url => Xhr.fetch(url, {
                method: 'GET'
            }));
    }

    @Mutation setTitle(title: String) {
        ({
            entity: this.book,
            flagService: this.flagService
        } = this.entityModuleService.propertyUpdate<BookEntity>(this.book, this.flagService, 'title', title));
    }

    @Mutation setYear(year: String) {
        ({
            entity: this.book,
            flagService: this.flagService
        } = this.entityModuleService.propertyUpdate<BookEntity>(this.book, this.flagService, 'year', year));
    }

    @Mutation setPageCount(pageCount: Number) {
        ({
            entity: this.book,
            flagService: this.flagService
        } = this.entityModuleService.propertyUpdate<BookEntity>(this.book, this.flagService, 'pageCount', pageCount));
    }

    @Mutation setIsbn(isbn: String) {
        ({
            entity: this.book,
            flagService: this.flagService
        } = this.entityModuleService.propertyUpdate<BookEntity>(this.book, this.flagService, 'isbn', isbn));
    }

    @Mutation setLanguage(language: String) {
        ({
            entity: this.book,
            flagService: this.flagService
        } = this.entityModuleService.propertyUpdate<BookEntity>(this.book, this.flagService, 'language', language));
    }

    @Mutation setSummary(summary: String) {
        ({
            entity: this.book,
            flagService: this.flagService
        } = this.entityModuleService.propertyUpdate<BookEntity>(this.book, this.flagService, 'summary', summary));
    }

    @Mutation addAuthor(author: AuthorEntity) {
        let authorAtIndex = this.bookService.hasAuthor(this.book, author);
        if (authorAtIndex === false) {
            this.book.authors.push(author);
            this.flagService.flags.isModified = true;
        }
    }

    @Mutation removeAuthor(author: AuthorEntity) {
        let authorAtIndex = this.bookService.hasAuthor(this.book, author);
        if (typeof authorAtIndex === 'number') {
            this.book.authors.splice(authorAtIndex, 1);
            this.flagService.flags.isModified = true;
        }
    }

    @Mutation setCover(cover: String) {
        this.book.cover = cover;
    }

    @Mutation setOwner(owner: UserEntity) {
        this.book.owner = owner;
    }

    @Mutation addGroup(group: GroupEntity) {
        this.book.groups.push(group);
    }
}
