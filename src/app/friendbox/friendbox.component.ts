import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-friendbox',
  standalone: true,
  imports: [NgFor],
  templateUrl: './friendbox.component.html',
  styleUrl: './friendbox.component.scss'
})
export class FriendboxComponent {
  names = ['Uwe', 'Manfred', 'Willy', 'Peter']
  texts = ['taucht gerne', 'spielt', 'freundlich', 'haarig']
  images = ['assets/img/capybara9.jpg',
    'assets/img/capybara10.jpg',
    'assets/img/capybara11.jpg',
    'assets/img/capybara12.jpg'
  ]
}
