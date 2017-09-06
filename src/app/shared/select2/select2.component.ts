import {
    Component, forwardRef, Input, OnInit, ElementRef, ViewChild, AfterContentInit, Output,
    EventEmitter
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {Observable, BehaviorSubject} from "rxjs/Rx";
import {TagInterface} from "../../domain_types";
declare let $: any;

const noop = (_?: any) => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
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

    @ViewChild("selector") selector: ElementRef;
    @Input() items: any[];
    @Input() options: '{}';
    @Input() required: boolean = false;
    @Input() value_property: string = '_id';
    @Input() text_property: string = 'name';
    @Output() onChange = new EventEmitter();
    private innerValue$ = new BehaviorSubject([]);
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    get value(): any {
        return this.innerValue$;
    };

    set value(v: any) {
        v = v || [];
        Observable.from(v)
            .flatMap(value => {
                let item$ = Observable.of(value);
                let search$ = Observable.from(this.items)
                    .filter(items => items != null)
                    .find((item: TagInterface) => item[this.value_property] == value)
                ;
                return Observable.combineLatest(item$, search$);
            })
            .map(data => {
                if (data[1]) {
                    return data[1];
                }
                return {
                    _id: null,
                    name: data[0],
                }
            })
            .toArray()
            .subscribe(items => {
                this.innerValue$.next(items);
                this.onChangeCallback(items);
                this.onChange.emit(items);
            })
        ;
    }

    ngAfterContentInit() {
        Observable.of(null).delay(20)
            .subscribe(() => {
                $(this.selector.nativeElement).select2(this.options);
                let $eventSelect = $(this.selector.nativeElement);
                $eventSelect.on("change", () => this.value = $(this.selector.nativeElement).val());
            })
        ;
    }

    isSelected$(tag: TagInterface) {
        return this.innerValue$
            .filter(items => items != null)
            .flatMap(items => Observable.from(items))
            .findIndex((item: TagInterface) => item._id == tag._id)
            .map(index => index != -1)
        ;
    }

    writeValue(value: any) {
        value = value || [];
        this.innerValue$.next(value);
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

}
