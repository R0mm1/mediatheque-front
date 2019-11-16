import {Mutation, getModule, Action, Module} from "vuex-module-decorators";
import {AuthorEntity, BookEntity, BookElectronicEntity, GroupEntity, FileEntity} from "@/assets/ts/entity/module";
import Xhr from "@/assets/js/xhr";
import store from "@/assets/js/store";
import EntityModuleInterface from "@/assets/ts/store/EntityModuleInterface";
import {BookModule} from "@/assets/ts/store/book/BookModule";

@Module({dynamic: true, name: 'bookElectronic', store: store, namespaced: true})
class BookElectronicModule extends BookModule implements EntityModuleInterface<BookElectronicEntity> {

    protected baseUrl: string = "/api/electronic_books/";

    book: BookElectronicEntity = this.bookService.getBaseElectronicBook();

    tempNewFile: undefined | File = undefined;

    @Action
    downloadEbook() {
        //todo: better way to avoid TS errors "Property XXX does not exist on type "ThisType<any>"
        // when accessing this.context.state.XXX?
        const state = (this.context.state as { tempNewFile: File });

        let promise = undefined;
        if (this.book.hasBookFile) {
            promise = Xhr.buildGetUrl('/api/electronic_books/' + this.book.id + '/file')
                .then(url => {
                    return Xhr.fetch(url, {
                        method: 'GET'
                    });
                })
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

    @Action
    get(id: Number): Promise<BookElectronicEntity | undefined> {

        const promise = super.getBase(id);

        return promise
            .then((book: BookEntity) => {
                this.set({
                    hasBookFile: (typeof book.bookFile === 'object'),
                    ...book
                });
                return this.book;
            });
    }

    @Action
    save(): Promise<boolean> {
        const method = this.bookService.isPersisted(this.book) ? 'PUT' : 'POST';
        const url = '/api/electronic_books' + method === 'PUT' ? '/' + this.book.id : '';

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
            .then((response: BookElectronicEntity) => {
                this.set(response);
                return Promise.resolve(true);
            })
            .catch(() => Promise.resolve(false));
    }

    @Mutation
    set(book: BookElectronicEntity) {
        this.flagService.reset();
        this.book = book;
    }

    @Mutation unlinkBookFile() {
        this.book.bookFile = undefined;
        this.book.hasBookFile = false;
        this.flagService.flags.isModified = true;
    }

    @Mutation linkNewFile(file: { file: File, name: string }) {
        this.tempNewFile = file.file;
        this.book.bookFile = {
            id: 0,
            path: file.name
        };
        this.flagService.flags.isModified = true;
    }
}

export default getModule(BookElectronicModule);
