import {BookEntity} from "@/assets/ts/entity/BookEntity";

export interface GroupEntity {
    id?: Number;
    books?: String[] | BookEntity[];
    comment?: String;
}
