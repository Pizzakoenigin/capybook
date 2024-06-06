import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CAPYBARAS } from '../../mock-capybara';

@Component({
  selector: 'app-friendbox',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './friendbox.component.html',
  styleUrl: './friendbox.component.scss'
})

export class FriendboxComponent {
  capybaras = CAPYBARAS

  @Input() canFollow = true;
  constructor() {

  }

  removeFriend(i) {
    this.capybaras[0].friends.splice(i, 1)
  }
}
