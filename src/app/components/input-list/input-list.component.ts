import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { getNextId } from 'src/app/utils/nextId';
import { objToString } from 'src/app/utils/objToString';

interface InputItem {
  id: number;
  value?: string;
}

@Component({
  selector: 'app-input-list',
  templateUrl: './input-list.component.html',
  styleUrls: ['./input-list.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputListComponent),
    },
  ],
})
export class InputListComponent implements OnInit, ControlValueAccessor {
  items: InputItem[] = [];
  isTouched = false;

  @Input() type = 'text';
  @Input() isDisabled = false;

  onChange = (_: any) => {};
  onTouched = (_: any) => {};

  ngOnInit(): void {}

  get values() {
    return this.items.map((e) => objToString(e.value));
  }

  @Input()
  set values(items: string[]) {
    this.items = items.map((e) => {
      return { id: getNextId(), value: e };
    });
  }

  add() {
    this.markAsTouched();

    this.items.push({
      id: getNextId(),
    });

    this.onChange(this.values);
  }

  update(id: number, value: string) {
    if (this.isDisabled) {
      return;
    }

    this.markAsTouched();

    const index = this.items.findIndex((e) => e.id === id);
    this.items[index].value = value;
    this.onChange(this.values);
  }

  delete(id: number) {
    this.markAsTouched();

    const index = this.items.findIndex((e) => e.id === id);
    this.items.splice(index, 1);
    this.onChange(this.values);
  }

  writeValue(obj: any): void {
    if (obj == null || obj.length === 0) {
      this.items = [];
    } else if (Array.isArray(obj)) {
      this.values = [...obj.map(objToString)];
    } else {
      this.values = [objToString(obj)];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  markAsTouched() {
    if (this.isTouched) {
      return;
    }

    this.isTouched = true;
  }
}
