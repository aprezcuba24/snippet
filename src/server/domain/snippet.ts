import { Document } from 'camo';
import {Tag} from "./tag";

class SnippetClass extends Document {
    constructor() {
        super();

        super.schema({
            title: String,
            body: String,
            tags: [Tag],
        });
    }
    static collectionName() {
        return 'snippet';
    }
}
export const Snippet: any = SnippetClass;