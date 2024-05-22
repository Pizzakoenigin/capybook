import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LikeService } from '../like.service';
import { Post } from '../posts';
import { POSTS } from '../../mock-posts';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-capy-card',
  standalone: true,
  imports: [
    MatIconModule,
    NgFor,
    NgIf
  ],
  templateUrl: './capy-card.component.html',
  styleUrl: './capy-card.component.scss'
  
})
export class CapyCardComponent {
  @Input() text: string = '';
  @Input() source: string = '';
  @Input() cardIndex: number = 0

  posts = POSTS

  comment: boolean

  constructor(public ls: LikeService) {

  }
}
