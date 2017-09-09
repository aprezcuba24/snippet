/**
 * Componente para gestionar el multiselect que se usa para los tags
 */

import {
  Component, forwardRef, Input, OnInit, ElementRef, ViewChild, AfterContentInit, Output,
  EventEmitter
} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {Observable, BehaviorSubject} from "rxjs/Rx";
import {TagInterface} from "../../domain_types";
declare let $:any;

const noop = (_?:any) => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR:any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Select2Component),
  multi: true
};

@Component({
  selector: 'select2',
  templateUrl: './select2.component.html',
  styleUrls: ['./select2.component.css'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class Select2Component implements ControlValueAccessor, AfterContentInit {

  @ViewChild("selector") selector:ElementRef;
  @Input() items:any[];
  @Input() options:'{}';
  @Input() required:boolean = false;
  @Input() value_property:string = '_id';
  @Input() text_property:string = 'name';
  @Output() onChange = new EventEmitter();
  private innerValue$ = new BehaviorSubject([]);
  private onTouchedCallback:() => void = noop;
  private onChangeCallback:(_:any) => void = noop;

  get value():any { // Devolver el observable con los elementos seleccionados
    return this.innerValue$;
  };

  set value(v:any) {
    v = v || [];
    Observable.from(v) // Hago un observable que emite todos los valores seleccionados
      .flatMap(value => {
        let item$ = Observable.of(value); // mando el mismo valor seleccionado por  el usuario
        let search$ = Observable.from(this.items) // Busco el elementos para ver si es uno de los mando inicialmente
            .filter(items => items != null)
            .find((item:TagInterface) => item[this.value_property] == value)
          ;
        return Observable.combineLatest(item$, search$); // Devuelvo un observable con los dos valores, el puesto por el usuario y el que ya tenía almacenado
      })
      .map(data => {
        if (data[1]) { // Si ya tenía el tag lo devuelvo
          return data[1];
        }
        return { // Si no tenía el tag, es nuevo, y creo un nuevo objeto
          _id: null,
          name: data[0],
        }
      })
      .toArray() // Agrupo todos los tags en un array
      .subscribe(items => { // Pongo los tags seleccionado en la propiedad y envío los métodos correspondientes
        this.innerValue$.next(items);
        this.onChangeCallback(items);
        this.onChange.emit(items);
      })
    ;
  }

  ngAfterContentInit() {
    Observable.of(null).delay(20) // hago un espera de 20 milisengudo para que se pinte la pantalla y poder crear el select2
      .subscribe(() => {
        $(this.selector.nativeElement).select2(this.options);
        let $eventSelect = $(this.selector.nativeElement);
        $eventSelect.on("change", () => this.value = $(this.selector.nativeElement).val());
      })
    ;
  }

  /**
   * Método que devuelve un observable que dice si un tag está seleccionado
   * @param tag
   * @returns {any}
     */
  isSelected$(tag:TagInterface) {
    return this.innerValue$
      .filter(items => items != null)
      .flatMap(items => Observable.from(items))
      .findIndex((item:TagInterface) => item._id == tag._id)
      .map(index => index != -1)
      ;
  }

  writeValue(value:any) {
    value = value || [];
    this.innerValue$.next(value);
  }

  registerOnChange(fn:any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn:any) {
    this.onTouchedCallback = fn;
  }

}
