export interface Entity<T> {
    save?: () => PromiseLike<{}>
}

export interface SnippetInterface extends Entity<SnippetInterface> {
    _id?: string,
    title: String,
    body: String,
    tags: string|string[],
    cantViews?: number,
}
export interface TagInterface extends Entity<TagInterface> {
    _id?: string,
    name: String,
}