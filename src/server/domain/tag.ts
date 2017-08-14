import { Document } from 'camo';

class TagClass extends Document {
    constructor() {
        super('tag');

        super.schema({
            name: String,
        });
    }
}
export const Tag:any = TagClass;