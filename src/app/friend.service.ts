import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  names: string[] = []
  texts: string[] = []
  images: string[] = []
  constructor() { }

  addFriend(name:string, text:string, image:string){
    this.names.push(name);
    this.texts.push(text);
    this.images.push(image)
  }

    removeFriend(index){
      // index -= 1
    this.names.splice(index, 1)
    this.texts.splice(index, 1)
    this.images.splice(index, 1)
  }
}
