import { IpcInput, IpcService } from './../IpcService';
import { Observable } from 'rxjs/Rx';
import { Tag } from './../domain/tag';
import { Injectable } from '@angular/core';

@Injectable()
export class TagProcess {
    private tagAllEvent;

    constructor(
        private ipc: IpcService
    ) {
        this.ipc.process(
            'tag.all',
            (data: IpcInput) => {
                this.tagAllEvent = data.event;
                return this.getAll$()
            }
        );
    }

    refreshAll() {
        this.getAll$().subscribe(
            tags => this.ipc.send('tag.all', this.tagAllEvent, {
                data: tags
            })
        );
    }

    getAll$() {
        return Observable.fromPromise(Tag.find({}, {
            sort: 'name'
        }));
    }

    getOrCreated$(tags: string[]) {
        return Observable.from(tags)
            .flatMap(item => Observable.combineLatest(
                Observable.of(item),
                Observable.fromPromise(Tag.findOne({
                    name: item
                }))
            ))
            .flatMap(data => {
                if (data[1] == null) {
                    let tag = Tag.create({
                        name: data[0]
                    });
                    return Observable.fromPromise(tag.save());
                }
                return Observable.of(data[1]);
            })
            .toArray()
            .do(() => this.refreshAll())
        ;
    }
}