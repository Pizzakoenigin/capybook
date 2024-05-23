import { Component, Input } from '@angular/core';
import { FriendService } from '../friend.service';
import { NgIf } from '@angular/common';
import { CAPYBARAS } from '../../mock-capybara';

@Component({
  selector: 'app-profile-row',
  standalone: true,
  imports: [NgIf],
  templateUrl: './profile-row.component.html',
  styleUrl: './profile-row.component.scss'
})
export class ProfileRowComponent {
  // @Input() canFollow = true;

  capybaras = CAPYBARAS

  constructor(public fs:FriendService) {

  }
}
