import {createLocalVue} from "@vue/test-utils";
import Vuex from 'vuex';

import bookElectronicModule from "@/assets/ts/store/book/BookElectronicModule"
import BookService from "@/assets/ts/service/BookService";
import Xhr from '@/assets/js/xhr';

global.Headers = global.Headers || require("fetch-headers");

describe('BookElectronicModule', () => {
    let bookService = new BookService();

    beforeEach(() => {
        const localVue = createLocalVue();
        localVue.use(Vuex);

        bookElectronicModule.init();
    });

    it('Is correctly initialized', () => {
        expect(bookElectronicModule.book).toStrictEqual(bookService.getBaseElectronicBook());
    });

    it('Correctly handle modifications', () => {
        expect(bookElectronicModule.historyService.history.length).toBe(0);
        expect(bookElectronicModule.flagService.flags.isModified).toBe(false);

        bookElectronicModule.setTitle('A book title');
        bookElectronicModule.setYear('2019');
        bookElectronicModule.setPageCount('123');
        bookElectronicModule.setIsbn('123-456-789');
        bookElectronicModule.setLanguage('Français');
        bookElectronicModule.setSummary('Il était une fois...');

        expect(bookElectronicModule.book.title).toBe('A book title');
        expect(bookElectronicModule.book.year).toBe('2019');
        expect(bookElectronicModule.book.pageCount).toBe(123);
        expect(bookElectronicModule.book.isbn).toBe('123-456-789');
        expect(bookElectronicModule.book.language).toBe('Français');
        expect(bookElectronicModule.book.summary).toBe('Il était une fois...');

        expect(bookElectronicModule.historyService.history.length).toBe(6);
        expect(bookElectronicModule.flagService.flags.isModified).toBe(true);
    });

    it('Correctly handle authors modifications', () => {
        const author1 = {
            id: 1, firstname: 'Victor', lastname: 'Hugo'
        };
        const author2 = {
            id: 2, firstname: 'Jules', lastname: 'Verne'
        };

        bookElectronicModule.addAuthor(author1);
        bookElectronicModule.addAuthor(author2);
        bookElectronicModule.addAuthor(author2); //Check if the author is not added twice
        expect(bookElectronicModule.book.authors.length).toBe(2);
        expect(bookElectronicModule.historyService.history.length).toBe(2);

        bookElectronicModule.removeAuthor(author1);
        expect(bookElectronicModule.book.authors.length).toBe(1);
        expect(bookElectronicModule.historyService.history.length).toBe(3);

        expect(bookElectronicModule.flagService.flags.isModified).toBe(true);
    });

    it('Correctly handle owner modifications', () => {
        bookElectronicModule.setOwner(1);
        expect(bookElectronicModule.book.owner).toBe('/api/users/1');

        bookElectronicModule.setOwner('/api/users/2');
        expect(bookElectronicModule.book.owner).toBe('/api/users/2');

        const owner3 = {
            id: 3,
            username: 'Romain'
        };
        bookElectronicModule.setOwner(owner3);
        expect(bookElectronicModule.book.owner).toStrictEqual(owner3);

        expect(bookElectronicModule.historyService.history.length).toBe(3);
        expect(bookElectronicModule.flagService.flags.isModified).toBe(true);
    });

    it('Correctly handle book set', () => {
        //Make a modification to see if all services reinitialization is well done after the book changed
        bookElectronicModule.setTitle('A title');
        expect(bookElectronicModule.flagService.flags.isModified).toBe(true);
        expect(bookElectronicModule.historyService.history.length).toBe(1);

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

        bookElectronicModule.set(book);
        expect(bookElectronicModule.book).toStrictEqual(book);
        expect(bookElectronicModule.flagService.flags.isModified).toBe(false);
        expect(bookElectronicModule.historyService.history.length).toBe(0);
    });

    it('Correctly handle new book file', async () => {
        const apiResponse = {
            '@id': 1,
            id: 1,
            path: '123456789.epub'
        };

        Xhr.fetch = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve(apiResponse);
        });

        await bookElectronicModule.linkNewFile({
            file: new File([''], 'my-epub.epub'),
            name: 'my-epub.epub'
        });

        expect(bookElectronicModule.book.bookFile).toStrictEqual(apiResponse);
        expect(bookElectronicModule.flagService.flags.isModified).toBeTruthy();
        expect(bookElectronicModule.flagService.flags.readyToSave).toBeTruthy();
        expect(bookElectronicModule.historyService.history.length).toBe(1);
    });

    it('Correctly get book from API', async () => {
        //Make a modification to see if all services reinitialization is well done after the book changed
        bookElectronicModule.setTitle('A title');
        expect(bookElectronicModule.flagService.flags.isModified).toBe(true);
        expect(bookElectronicModule.historyService.history.length).toBe(1);

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
            ],
            hasBookFile: false
        };

        Xhr.fetch = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve(book);
        });

        const bookReturned = await bookElectronicModule.get(10);

        expect(bookElectronicModule.book).toStrictEqual(book);
        expect(bookElectronicModule.book).toStrictEqual(bookReturned);
        expect(bookElectronicModule.flagService.flags.isModified).toBe(false);
        expect(bookElectronicModule.historyService.history.length).toBe(0);
    });

    it('Correctly save book', async () => {

        Xhr.fetch = jest.fn().mockImplementationOnce((url, params) => {
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

        bookElectronicModule.set(book);
        await bookElectronicModule.save();

        expect(Xhr.fetch.mock.calls[0]).toBeDefined();
        const fetchCall = Xhr.fetch.mock.calls[0];

        expect(fetchCall[0]).toMatch(/api\/electronic_books$/);
        expect(fetchCall[1].method).toBeDefined();
        expect(fetchCall[1].headers).toBeDefined();
        expect(fetchCall[1].body).toBeDefined();

        expect(fetchCall[1].method).toBe('POST');
        expect(JSON.parse(fetchCall[1].body)).toStrictEqual({
            title: 'Le Grand Meaulnes',
            authors: [
                '/api/authors/1'
            ],
            cover: '/api/covers/1',
            groups: []
        });
    });
});
