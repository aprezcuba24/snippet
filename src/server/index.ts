import { SnippetProcess } from './process/SnippetProcess';
import { TagProcess } from './process/TagProcess';
import { IpcService } from './IpcService';
import { MainProcess } from './process/MainProcess';
import { ReflectiveInjector } from '@angular/core';

let injector = ReflectiveInjector.resolveAndCreate([
    MainProcess,
    TagProcess,
    SnippetProcess,
    IpcService,
]);
injector.get(MainProcess);
injector.get(TagProcess);
injector.get(SnippetProcess);
