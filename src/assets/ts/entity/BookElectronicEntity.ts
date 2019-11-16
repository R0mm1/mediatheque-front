import {BookEntity} from "@/assets/ts/entity/BookEntity";
import {FileEntity} from "@/assets/ts/entity/FileEntity";

export interface BookElectronicEntity extends BookEntity {
    bookFile?: string | FileEntity;

    hasBookFile: boolean;
}
