import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CAPYBARAS } from '../../mock-capybara';
import { DataService } from '../data.service';
import { FriendService } from '../friend.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-friendbox',
  standalone: true,
  imports: [NgFor, NgIf, RouterOutlet, RouterLink],
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

    for (let i = 0; i < this.capybaras.length; i++) {
      const capy = this.capybaras[friendNumber].friends[i];
      if (i === friendNumber) {
        ; continue; // Skip the execution for the fifth index we don't want to add the capy to it's own profile
      }
      this.capybaras[friendNumber].friends.push(this.capybaras[i]);
      dataService.initAddFriendsToCapies = false
    }

    this.capybaras[3].friends.push(this.capybaras[2])
    this.capybaras[2].friends.push(this.capybaras[3])
    this.capybaras[0].friends.push(this.capybaras[friendNumber])
    this.capybaras[friendNumber].canFollow = false;
  };

  constructor(public dataService: DataService, public friendService: FriendService) {
    if (dataService.initAddFriendsToCapies) {
      this.addFriendsToCapies(dataService)
    }
  }
}
