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
  @Output() readonly onEdit = new EventEmitter<void>();
  @Output() readonly onDelete = new EventEmitter<void>();
  @Input() iconClass = '';
  @Input() theme: 'red' | 'light' = 'red';
}
