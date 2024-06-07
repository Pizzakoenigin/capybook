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

    // posts = POSTS

    capybaras = CAPYBARAS

  constructor() { }

    addPost() {
        if (this.content !== '') {
            // new POSTS
            this.capybaras[0].posts.push()

        }


        this.content = ''
    }
}