import {Component, forwardRef, Input, OnInit, ElementRef, ViewChild} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
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
export class Select2Component implements ControlValueAccessor, OnInit {

  private innerValue: any = [];
  @ViewChild("selector") selector: ElementRef;

  @Input() items: any[];
  @Input() options: '{}';
  @Input() required: boolean = false;
  @Input() multiple: boolean = false;
  @Input() value_property: string = '_id';
  @Input() text_property: string = 'name';

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  get value(): any {
    return this.innerValue;
  };

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  ngOnInit() {
    $(this.selector.nativeElement).select2(this.options);
    let $eventSelect = $(this.selector.nativeElement);
    $eventSelect.on("change", () => this.value = $(this.selector.nativeElement).val());
  }

  writeValue(value: any) {
    value = value || [];
    console.log(value)
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

}
