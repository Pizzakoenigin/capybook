import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CAPYBARAS } from '../../mock-capybara';
import { DataService } from '../data.service';

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

  addFriendsToCapies(dataService) {
    let friendNumber: number = 5;
    for (let i = 1; i < this.capybaras.length; i++) {
      const capy = this.capybaras[i];
      if (i === friendNumber) {
        ; continue; // Skip the execution for the fifth index we don't want to add the capy to it's own profile
      }
      capy.friends.push(this.capybaras[friendNumber]);
      dataService.initAddFriendsToCapies = false
    }
  };

  constructor(public dataService: DataService) {
    if (dataService.initAddFriendsToCapies) {
      this.addFriendsToCapies(dataService)
    }
  }

  removeFriend(i) {
    this.capybaras[0].friends.splice(i, 1)
    this.dataService.friendListLength = this.capybaras[0].friends.length+2
    console.log(this.dataService.friendListLength, this.capybaras.length);

  }
}
