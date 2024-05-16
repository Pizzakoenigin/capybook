import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  names = ['Uwe', 'Manfred', 'Willy', 'Peter']
  texts = ['taucht gerne', 'spielt', 'freundlich', 'haarig']
  images = ['assets/img/capybara9.jpg',
    'assets/img/capybara10.jpg',
    'assets/img/capybara11.jpg',
    'assets/img/capybara12.jpg'
  ]
  constructor() { }
}
