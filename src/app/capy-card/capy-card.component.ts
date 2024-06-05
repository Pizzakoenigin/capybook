import { Component, Input} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LikeService } from '../like.service';
import { POSTS } from '../../mock-posts';
import { CAPYBARAS } from '../../mock-capybara';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-capy-card',
  standalone: true,
  imports: [
    MatIconModule,
    NgFor,
    NgIf,
    FormsModule
  ],
  templateUrl: './capy-card.component.html',
  styleUrl: './capy-card.component.scss'
  
})
export class CapyCardComponent {
  @Input() text: string = '';
  @Input() source: string = '';
  @Input() cardIndex: number = 0

  posts = POSTS

  capybaras = CAPYBARAS

  newComment: string = ''

  constructor(public ls: LikeService) {

  }

  addComment(post: any) {
    if (this.newComment !== '') {
      post.userComment.push(this.newComment);
    }
    this.newComment = '';
  }

  editComment(post: any, index: number) {
    post.editComment = true
    const commentToEdit = post.userComment[index]
  }

  removeComment(post: any, index) {
    post.userComment.splice(index, 1)
  }
}
