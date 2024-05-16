import { Component, Input } from '@angular/core';
import { FriendService } from '../friend.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile-row',
  standalone: true,
  imports: [NgIf],
  templateUrl: './profile-row.component.html',
  styleUrl: './profile-row.component.scss'
})
export class ProfileRowComponent {
  @Input() name = 'Capybara';
  @Input() source = 'assets/img/capybara12.jpg';
  @Input() text = 'Das bist du';
  @Input() canFollow = true;

  constructor(public fs:FriendService) {

  }
}
