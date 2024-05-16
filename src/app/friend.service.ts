import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  names = ['Uwe', 'Manfred']
  texts = ['taucht gerne', 'spielt', 'freundlich', 'haarig']
  images = ['assets/img/capybara9.jpg',

  ]
  constructor() { }

  addFriend(name:string, text:string, image:string){
    this.names.push(name);
    this.texts.push(text);
    this.images.push(image)
  }
}
