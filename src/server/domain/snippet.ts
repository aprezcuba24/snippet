import { Document } from 'camo';
import {Tag} from "./tag";

class SnippetClass extends Document {

    _id: string;
    createdAt: Date;
    updatedAt: Date;
    cantViews: number;

    constructor() {
        super();
        super.schema({
            title: String,
            body: String,
            tags: [Tag],
            createdAt: Date,
            updatedAt: Date,
            cantViews: Number,
        });
    }
    static collectionName() {
        return 'snippet';
    }
    preSave() {
        if (!this._id) {
            this.createdAt = new Date();
            this.cantViews = 0;
        }
        this.updatedAt = new Date();
    }
}
export const Snippet: any = SnippetClass;