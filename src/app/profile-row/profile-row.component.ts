import { Component, Input } from '@angular/core';
import { FriendService } from '../friend.service';
import { DataService } from '../data.service';
import { NgIf } from '@angular/common';
import { CAPYBARAS } from '../../mock-capybara';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile-row',
  standalone: true,
  imports: [NgIf, RouterOutlet, RouterLink],
  templateUrl: './profile-row.component.html',
  styleUrl: './profile-row.component.scss'
})
export class ProfileRowComponent {
  // @Input() canFollow = true;

  capybaras = CAPYBARAS

  constructor(public fs:FriendService, public dataService: DataService) {

    }
  

    setprofileIndex() {
      console.log('klick');
      console.log(this.dataService.profileIndex);
      
      this.dataService.profileIndex = 420;
}
}
