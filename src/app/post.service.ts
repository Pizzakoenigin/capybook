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
  wordsArray;
  hashtagArray;
  wordsString;
  hashtagString: string = ''

  posts = POSTS

  capybaras = CAPYBARAS

  showInput: boolean = false

  constructor() { }

  addHashtags() {
  }

  addPost() {
    if (this.content !== '') {
      this.wordsArray = this.hashtags.split(' ');
      const filteredArray = this.wordsArray.filter(element => element !== '');
      this.wordsArray = filteredArray
      this.hashtagArray = this.wordsArray.map(word => '#' + word);
      this.wordsString = this.hashtagArray.join(' ');

      const newPost: Post = {
        id: this.capybaras[0].posts.length,
        date: new Date(),
        content: this.content,
        // hashtags: this.hashtags,
        hashtags: this.wordsString,
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
      this.hashtags = '';
      this.showInput = false
    }
  }

  removePost(index) {
    this.capybaras[0].posts.splice(index, 1)
  }
}