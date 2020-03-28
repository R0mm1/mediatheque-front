import "reflect-metadata";
import {createLocalVue} from "@vue/test-utils";
import Vuex from 'vuex';

import bookPaperModule from "@/assets/ts/store/book/BookPaperModule"
import BookService from "@/assets/ts/service/BookService";
import Request from "@/assets/ts/objects/Request";
import UrlBuilder from "@/assets/ts/objects/UrlBuilder";

import {container} from 'tsyringe';
import RequestService from "@/assets/ts/service/RequestService";

global.Headers = global.Headers || require("fetch-headers");

describe('BookPaperModule', () => {
    let bookService = new BookService();
    let requestService = container.resolve(RequestService);

    beforeEach(() => {
        const localVue = createLocalVue();
        localVue.use(Vuex);

        bookPaperModule.init();
    });

    it('Is correctly initialized', () => {
        expect(bookPaperModule.book).toStrictEqual(bookService.getBasePaperBook());
    });

    it('Correctly handle modifications', () => {
        expect(bookPaperModule.historyService.history.length).toBe(0);
        expect(bookPaperModule.flagService.flags.isModified).toBe(false);

        bookPaperModule.setTitle('A book title');
        bookPaperModule.setYear('2019');
        bookPaperModule.setPageCount('123');
        bookPaperModule.setIsbn('123-456-789');
        bookPaperModule.setLanguage('Français');
        bookPaperModule.setSummary('Il était une fois...');

        expect(bookPaperModule.book.title).toBe('A book title');
        expect(bookPaperModule.book.year).toBe('2019');
        expect(bookPaperModule.book.pageCount).toBe(123);
        expect(bookPaperModule.book.isbn).toBe('123-456-789');
        expect(bookPaperModule.book.language).toBe('Français');
        expect(bookPaperModule.book.summary).toBe('Il était une fois...');

        expect(bookPaperModule.historyService.history.length).toBe(6);
        expect(bookPaperModule.flagService.flags.isModified).toBe(true);
    });

    it('Correctly handle authors modifications', () => {
        const author1 = {
            id: 1, firstname: 'Victor', lastname: 'Hugo'
        };
        const author2 = {
            id: 2, firstname: 'Jules', lastname: 'Verne'
        };

        bookPaperModule.addAuthor(author1);
        bookPaperModule.addAuthor(author2);
        bookPaperModule.addAuthor(author2); //Check if the author is not added twice
        expect(bookPaperModule.book.authors.length).toBe(2);
        expect(bookPaperModule.historyService.history.length).toBe(2);

        bookPaperModule.removeAuthor(author1);
        expect(bookPaperModule.book.authors.length).toBe(1);
        expect(bookPaperModule.historyService.history.length).toBe(3);

        expect(bookPaperModule.flagService.flags.isModified).toBe(true);
    });

    it('Correctly handle owner modifications', () => {
        bookPaperModule.setOwner(1);
        expect(bookPaperModule.book.owner).toBe('/users/1');

        bookPaperModule.setOwner('/users/2');
        expect(bookPaperModule.book.owner).toBe('/users/2');

        const owner3 = {
            id: 3,
            username: 'Romain'
        };
        bookPaperModule.setOwner(owner3);
        expect(bookPaperModule.book.owner).toStrictEqual(owner3);

        expect(bookPaperModule.historyService.history.length).toBe(3);
        expect(bookPaperModule.flagService.flags.isModified).toBe(true);
    });

    it('Correctly handle book set', () => {
        //Make a modification to see if all services reinitialization is well done after the book changed
        bookPaperModule.setTitle('A title');
        expect(bookPaperModule.flagService.flags.isModified).toBe(true);
        expect(bookPaperModule.historyService.history.length).toBe(1);

        const book = {
            id: 10,
            title: "It's a book",
            year: 2019,
            authors: [
                {
                    id: 20,
                    firstname: "Author's firstname",
                    lastname: "Author's lastname"
                }
            ]
        };

        bookPaperModule.set(book);
        expect(bookPaperModule.book).toStrictEqual(book);
        expect(bookPaperModule.flagService.flags.isModified).toBe(false);
        expect(bookPaperModule.historyService.history.length).toBe(0);
    });

    it('Correctly get book from API', async () => {
        //Make a modification to see if all services reinitialization is well done after the book changed
        bookPaperModule.setTitle('A title');
        expect(bookPaperModule.flagService.flags.isModified).toBe(true);
        expect(bookPaperModule.historyService.history.length).toBe(1);

        const book = {
            id: 20,
            title: "It's a book II",
            year: 2020,
            authors: [
                {
                    id: 21,
                    firstname: "Author II's firstname",
                    lastname: "Author II's lastname"
                }
            ]
        };

        requestService.execute = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve(book);
        });

        const bookReturned = await bookPaperModule.get(10);

        expect(bookPaperModule.book).toStrictEqual(book);
        expect(bookPaperModule.book).toStrictEqual(bookReturned);
        expect(bookPaperModule.flagService.flags.isModified).toBe(false);
        expect(bookPaperModule.historyService.history.length).toBe(0);
    });

    it('Correctly save book', async () => {

        requestService.execute = jest.fn().mockImplementationOnce((url, params) => {
            return Promise.resolve({
                title: 'Le Grand Meaulnes',
                authors: [
                    '/api/authors/1',
                ],
                cover: '/api/covers/1'
            });
        });

        const book = {
            title: 'Le Grand Meaulnes',
            authors: [
                {
                    id: 1,
                    firstname: '',
                    lastname: 'Alain-Fournier'
                }
            ],
            cover: {
                '@id': '/api/covers/1',
                'path': '123.jpg'
            },
            groups: []
        };

        bookPaperModule.set(book);
        await bookPaperModule.save();

        expect(requestService.execute.mock.calls[0]).toBeDefined();
        const fetchCall = requestService.execute.mock.calls[0];

        expect(fetchCall[0]).toBeInstanceOf(Request);
        expect(fetchCall[0].getUrl()).toBeDefined();
        expect(fetchCall[0].getHeaders()).toBeDefined();
        expect(fetchCall[0].getBody()).toBeDefined();
        expect(fetchCall[0].getUrlBuilder()).toBeInstanceOf(UrlBuilder);
        expect(fetchCall[0].getUrlBuilder().getUrl()).toMatch(/\/paper_books$/);

        expect(fetchCall[0].getMethod()).toBe('POST');
        expect(JSON.parse(fetchCall[0].getBody())).toStrictEqual({
            title: 'Le Grand Meaulnes',
            authors: [
                '/api/authors/1'
            ],
            cover: '/api/covers/1',
            groups: []
        });
    });
});
