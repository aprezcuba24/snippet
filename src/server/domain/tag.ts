import { Document } from 'camo';

class TagClass extends Document {
    constructor() {
        super();

        super.schema({
            name: String,
        });
    }
    static collectionName() {
        return 'tag';
    }
}
export const Tag:any = TagClass;