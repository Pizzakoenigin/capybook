import { Component, Input, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LikeService } from '../like.service';
import { Post } from '../posts';
import { POSTS } from '../../mock-posts';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

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

  comment: boolean

  newComment: string = ''

  constructor(public ls: LikeService) {

  }

  addComment(post: any) {
    post.comments.push(this.newComment);
    this.newComment = '';
  }
}
