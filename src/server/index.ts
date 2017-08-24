import { TagProcess } from './process/TagProcess';
import { IpcService } from './IpcService';
import { MainProcess } from './process/MainProcess';
import { ReflectiveInjector } from '@angular/core';
import { server } from '../environments/server';
import { Tag } from './domain/tag';
import { Document, connect } from 'camo';

let injector = ReflectiveInjector.resolveAndCreate([
    MainProcess,
    TagProcess,
    IpcService,
]);
injector.get(MainProcess);
injector.get(TagProcess);

// let database;
// connect(server.db_connection).then(db => {
//     database = db;
//     let tag = Tag.create({
//         name: 'Renier'
//     });
//     tag.save().then(function (l) {
//         console.log(l);
//     });
// });