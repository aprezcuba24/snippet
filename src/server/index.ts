import { server } from '../environments/server';
import { Tag } from './domain/tag';
import { Document, connect } from 'camo';

let database;
connect(server.db_connection).then(db => {
    database = db;
    let tag = Tag.create({
        name: 'Renier'
    });
    tag.save().then(function (l) {
        console.log(l);
    });
});