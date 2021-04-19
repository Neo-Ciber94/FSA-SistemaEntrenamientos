import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CardComponent {
  // tslint:disable: no-output-on-prefix
  @Output() readonly onEdit = new EventEmitter<void>();
  @Output() readonly onDelete = new EventEmitter<void>();

  @Input() editRoute?: string | any[];
  @Input() deleteRoute?: string | any[];

  @Input() iconClass = '';
  @Input() theme: 'red' | 'light' = 'red';
}
