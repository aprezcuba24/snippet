import {Observable} from "rxjs/Rx";

export interface Entity<T> {
    // save() => Observable<T>
}

export interface SnippetInterface extends Entity<SnippetInterface> {
    _id?: string,
    title: String,
    body: String,
}
export interface TagInterface extends Entity<TagInterface> {
    _id?: string,
    name: String,
}