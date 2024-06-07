import { Injectable } from '@angular/core';
import { POSTS } from '../mock-posts';
import { CAPYBARAS } from '../mock-capybara';
import { Post } from "./post";

@Injectable({
  providedIn: 'root'
})

export class PostService {

    content: string = ''

    // post = Post

    posts = POSTS

    capybaras = CAPYBARAS

    showInput: boolean = false

    // postCount: number = ;

    // postDate = new Date()

  constructor() {
    // console.log(this.posts.length);
    this.capybaras.forEach((capy) => console.log(capy.posts))
    }
    // console.log(this.capybaras.posts);
    
   
    // clearInput() {
    //   this.content = ''
    // }


    addPost() {
        if (this.content !== '') {
            const newPost: Post = {
                id:  this.posts.length + 1,
                date: new Date(),
                content: this.content,
                // hashtags: 'angular, coding',
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


        // this.content = ''
    }
}