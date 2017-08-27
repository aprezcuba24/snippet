import { Document } from 'camo';

class SnippetClass extends Document {
    constructor() {
        super();

        super.schema({
            title: String,
            body: String,
        });
    }
    static collectionName() {
        return 'snippet';
    }
}
export const Snippet: any = SnippetClass;