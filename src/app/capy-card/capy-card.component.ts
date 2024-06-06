import { Component, Input} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LikeService } from '../like.service';
import { POSTS } from '../../mock-posts';
import { CAPYBARAS } from '../../mock-capybara';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-capy-card',
  standalone: true,
  imports: [
    MatIconModule,
    NgFor,
    NgIf,
    DatePipe,
    FormsModule
  ],
  providers: [
    DatePipe
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

  // currentDate: Date 

  constructor(public ls: LikeService, private datePipe: DatePipe) {

    // this.capybaras[0].friends.push(this.capybaras[1], this.capybaras[2]),  //friends get pushed to the objects after they got declared in mock.capybaras
    // this.capybaras[0].friends.push() 
    
    console.log(this.capybaras[0].friends);
    
  }

  addComment(post: any) {
    if (this.newComment !== '') {
      post.userComment.push(this.newComment);
    }
    this.newComment = '';
  }

  // editComment(post: any, index: number) {
  //   post.editComment = true
  //   const commentToEdit = post.userComment[index]
  // }

  removeComment(post: any, index) {
    post.userComment.splice(index, 1)
  }

  trackByFn(index) {
    return index;  }
}
