import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-capy-card',
  standalone: true,
  imports: [],
  templateUrl: './capy-card.component.html',
  styleUrl: './capy-card.component.scss'
})
export class CapyCardComponent {
  @Input() text: string = '';
  @Input() source: string = '';
}
