import { Injectable } from '@angular/core';
import { POSTS } from '../mock-posts';
import { CAPYBARAS } from '../mock-capybara';
import { Post } from "./post";

@Injectable({
  providedIn: 'root'
})

export class PostService {
    content: string = ''
    hashtags: string = ''
    posts = POSTS

    capybaras = CAPYBARAS

    showInput: boolean = false

  constructor() { }

    addPost() {
        if (this.content !== '') {
            const newPost: Post = {
                id:  this.posts.length + 1,
                date: new Date(),
                content: this.content,
                hashtags: this.hashtags,
                // source: 'You.com',
                likes: 0,
                liked: false,
                commentPossible: true,
                editComment: false,
                comments: [],
                userComment: [],
            };
            this.capybaras[0].posts.push(newPost)
            this.content = '';
            this.showInput = false
        }
    }
}