import {BookEntity, BookPaperEntity, BookElectronicEntity, AuthorEntity} from "@/assets/ts/entity/module";
import FlagService from "@/assets/ts/service/FlagService";

export default class BookService {
    static bookElectronic: String = 'ElectronicBook';
    static bookPaper: String = 'PaperBook';


    getBaseBook(): BookEntity {
        return {
            authors: [],
            groups: []
        };
    }

    getBasePaperBook(): BookPaperEntity {
        return this.getBaseBook();
    }

    getBaseElectronicBook(): BookElectronicEntity {
        return {
            ...this.getBaseBook(),
            hasBookFile: false
        };
    }

    isPersisted(book: BookEntity): boolean {
        return book.id !== -1;
    }

    hasAuthor(book: BookEntity, author: AuthorEntity): boolean | number {
        let hasAuthor: boolean | number = false;
        book.authors.forEach((bookAuthor: AuthorEntity, index) => {
            if (author.id === bookAuthor.id) hasAuthor = index;
        });
        return hasAuthor;
    }
}
