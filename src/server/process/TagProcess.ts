import { IpcInput, IpcService } from './../IpcService';
import { Observable } from 'rxjs/Rx';
import { Tag } from './../domain/tag';
import { Injectable } from '@angular/core';

@Injectable()
export class TagProcess {
    constructor(
        private ipc: IpcService
    ) {
        this.ipc.process(
            'tag.all',
            this.getAll$.bind(this)
        );
    }

    getAll$(data: IpcInput) {
        return Observable.fromPromise(Tag.find({}, {
            sort: 'name'
        }));
    }
}