import { Snippet } from './../domain/snippet';
import { IpcInput, IpcService } from './../IpcService';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import {TagProcess} from "./TagProcess";
import {SnippetInterface, TagInterface} from "../../app/domain_types";
import * as MongoDb from 'mongodb';

@Injectable()
export class SnippetProcess {
    constructor(
        private ipc: IpcService,
        private tagProcess: TagProcess
    ) {
        this.ipc.process('snippet.create', this.create$.bind(this));
        this.ipc.process('snippet.more_used', this.moreUsed$.bind(this));
        this.ipc.process('snippet.newest', this.newest$.bind(this));
        this.ipc.process('snippet.get', this.get$.bind(this));
        this.ipc.process('snippet.edit', this.edit$.bind(this));
        this.ipc.process('snippet.search', this.search$.bind(this));
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

    paginate(data: IpcInput, query = {}, options = {}) {
        options = Object.assign(options, {
            skip: (data.arg.page - 1) * data.arg.itemsPerPage,
            limit: data.arg.itemsPerPage,
        });
        let count$ = Observable.fromPromise(Snippet.count(query, options));
        let items$ = Observable.fromPromise(Snippet.find(query, options));
        return Observable.combineLatest(count$, items$)
            .map(result => {
                return {
                    total: result[0],
                    items: result[1],
                }
            })
            ;
    }

    newest$(data: IpcInput) {
        return this.paginate(data, {}, {
            sort: '-createdAt',
        });
    }

    moreUsed$(data: IpcInput) {
        return this.paginate(data, {}, {
            sort: '-cantViews',
        });
    }

    search$(data: IpcInput) {
        return Observable.from(data.arg.tags)
            .map((item: TagInterface) => item._id)
            .map(id => new MongoDb.ObjectId(id))
            .toArray()
            .flatMap(ids => this.paginate(data, {
                tags: {$in: ids}
            }, {
                sort: '-cantViews',
            }))
        ;
    }

    get$(data: IpcInput) {
        return Observable.fromPromise(Snippet.findOne({
            _id: data.arg.id
        }))
            .flatMap((item: SnippetInterface) => {
                if (!data.arg.increment_view) {
                    return Observable.of(item);
                }
                item.cantViews++;
                return Observable.fromPromise(item.save());
            })
            ;
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