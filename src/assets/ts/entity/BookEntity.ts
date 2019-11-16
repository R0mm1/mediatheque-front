import {AuthorEntity, FileEntity, UserEntity} from './module';
import {GroupEntity} from "@/assets/ts/entity/GroupEntity";
import {Entity} from "@/assets/ts/entity/Entity";

export interface BookEntity extends Entity{
    id?: Number;
    title?: String;
    year?: String;
    pageCount?: Number;
    isbn?: String;
    language?: String;
    summary?: String;
    authors: AuthorEntity[];
    cover?: String | FileEntity;
    owner?: UserEntity;
    groups: GroupEntity[];
}
