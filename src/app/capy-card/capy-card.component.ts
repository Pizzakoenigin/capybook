import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LikeService } from '../like.service';
import { Post } from '../posts';
import { POSTS } from '../../mock-posts';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-capy-card',
  standalone: true,
  imports: [
    MatIconModule,
    NgFor
  ],
  templateUrl: './capy-card.component.html',
  styleUrl: './capy-card.component.scss'
  
})
export class CapyCardComponent {
  @Input() text: string = '';
  @Input() source: string = '';
  @Input() cardIndex: number = 0

  posts = POSTS

  // post: Post = {
  //   id: 1,
  //   author: 'Carlos',
  //   content: 'Mein Name ist Carlos und ich bin sehr müde',
  //   source: 'assets/img/capybara1.jpg',
  //   likes: 0,
  // }

  constructor(public ls: LikeService) {

  }
}
