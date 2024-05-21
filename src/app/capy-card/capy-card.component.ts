import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LikeService } from '../like.service';

@Component({
  selector: 'app-capy-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './capy-card.component.html',
  styleUrl: './capy-card.component.scss'
  
})
export class CapyCardComponent {
  @Input() text: string = '';
  @Input() source: string = '';
  @Input() cardIndex: number = 0

  constructor(public ls: LikeService) {

  }
}
