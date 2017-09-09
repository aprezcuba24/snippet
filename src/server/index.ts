import { SnippetProcess } from './process/SnippetProcess';
import { TagProcess } from './process/TagProcess';
import { IpcService } from './IpcService';
import { MainProcess } from './process/MainProcess';
import { ReflectiveInjector } from '@angular/core';

// Creo el injector, usando la Inyección de dependencias de Angular2 
let injector = ReflectiveInjector.resolveAndCreate([
    MainProcess,
    TagProcess,
    SnippetProcess,
    IpcService,
]);
// Hago un get de cada proceso para que se creen los objetos y hagan las conexión correspondientes
injector.get(MainProcess);
injector.get(TagProcess);
injector.get(SnippetProcess);
