import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FriendService } from '../friend.service';
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
  constructor(public fs: FriendService) {

  }

}
