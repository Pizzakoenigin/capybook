import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  names = []
  texts = []
  images = []
  constructor() { }

  addFriend(name:string, text:string, image:string){
    this.names.push(name);
    this.texts.push(text);
    this.images.push(image)
  }

  removeFriend(name:string, text:string, image:string){
    const index = this.names.indexOf(name)
    this.names = this.names.splice(index, 1)
    this.texts = this.texts.splice(index, 1)
    this.images = this.images.splice(index, 1)
  }
}
