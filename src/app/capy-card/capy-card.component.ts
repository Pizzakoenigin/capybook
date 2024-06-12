import { Component, Input} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LikeService } from '../like.service';
import { POSTS } from '../../mock-posts';
import { CAPYBARAS } from '../../mock-capybara';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreatePostComponent } from './create-post/create-post.component';

@Component({
  selector: 'app-capy-card',
  standalone: true,
  imports: [
    MatIconModule,
    NgFor,
    NgIf,
    DatePipe,
    FormsModule,
    CreatePostComponent
  ],
  providers: [
    DatePipe
  ],  
  templateUrl: './capy-card.component.html',
  styleUrl: './capy-card.component.scss'
  
})
export class CapyCardComponent {
  posts = POSTS

  capybaras = CAPYBARAS

  newComment: string = ''

  constructor(public ls: LikeService, private datePipe: DatePipe) {
    console.log(this.posts[0].comments);
    
  }

  addComment(post: any) {
    if (this.newComment !== '') {
      post.userComment.push(this.newComment);
    }
    this.newComment = '';
  }

  removeComment(post: any, index) {
    post.userComment.splice(index, 1)
  }

  trackByFn(index) {
    return index;  }
}
