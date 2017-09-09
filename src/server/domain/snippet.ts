import { Document } from 'camo';
import {Tag} from "./tag";

class SnippetClass extends Document { // Todas las entiedades deben heredar Document
  
    // Defino los campos de la clase
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    cantViews: number;

    constructor() {
        super();
        super.schema({ //Se define el modelo de datos
            title: String,
            body: String,
            tags: [Tag],
            createdAt: Date,
            updatedAt: Date,
            cantViews: Number,
        });
    }
    static collectionName() {
        return 'snippet'; // Nombre de la colección
    }
    preSave() { 
        // Hook que se lanza antes de salvar la entidad 
        if (!this._id) { // Si no tiene Id es porque se va a crear, entonces inicio los campos.
            this.createdAt = new Date();
            this.cantViews = 0;
        }
        this.updatedAt = new Date(); // En cualquier caso guardo la hora de actualización
    }
}
export const Snippet: any = SnippetClass;
