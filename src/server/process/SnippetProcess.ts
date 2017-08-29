import { Snippet } from './../domain/snippet';
import { IpcInput, IpcService } from './../IpcService';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import {TagProcess} from "./TagProcess";

@Injectable()
export class SnippetProcess {
    constructor(
        private ipc: IpcService,
        private tagProcess: TagProcess
    ) {
        this.ipc.process('snippet.create', this.create$.bind(this));
        this.ipc.process('snippet.more_used', this.moreUsed$.bind(this));
        this.ipc.process('snippet.get', this.get$.bind(this));
        this.ipc.process('snippet.edit', this.edit$.bind(this));
    }

    create$(data: IpcInput) {
        let snippet = Snippet.create(data.arg);
        return this.tagProcess.getOrCreated$(data.arg.tags)
            .flatMap(tags => {
                snippet.tags = tags;
                return Observable.fromPromise(snippet.save());
            })
            ;
    }

    moreUsed$() {
        return Observable.fromPromise(Snippet.find());
    }

    get$(data: IpcInput) {
        return Observable.fromPromise(Snippet.findOne({
            _id: data.arg
        }));
    }

    edit$(data: IpcInput) {
        let entity$ = Observable.fromPromise(Snippet.findOne({
            _id: data.arg._id
        }));
        let tags$ = this.tagProcess.getOrCreated$(data.arg.tags);
        return Observable.combineLatest(entity$, tags$, (entity: any, tags) => {
            entity.tags = tags;
            return entity;
        })
            .flatMap((entity: any) => {
                entity.body = data.arg.body;
                entity.title = data.arg.title;
                return Observable.fromPromise(entity.save());
            })
        ;
    }
}