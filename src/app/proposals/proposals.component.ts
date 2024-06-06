import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProfileRowComponent } from '../profile-row/profile-row.component';
import { CAPYBARAS } from '../../mock-capybara';
import { log } from 'console';

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ProfileRowComponent, NgFor, NgIf],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.scss'


})



export class ProposalsComponent {

  message: string;
  subscription: Subscription;

  capybaras = CAPYBARAS

  constructor(public dataService: DataService) { }

  setprofileIndex() {
    console.log('klick');
    console.log(this.dataService.profileIndex);

    this.dataService.profileIndex = 0;
  }

  addFriend(i) {
    this.capybaras[0].friends.push(this.capybaras[i] )
    console.log(this.capybaras[0].friends);
    
  }



  // friendCount() {
  //   this.capybaras.forEach(capy => {
  //     if (capy.canFollow) {
  //       this.dataService.friendCount--;


  //     } else {
  //       this.dataService.friendCount++;
  //     }
  //   });

  //   console.log(this.dataService.friendCount);
  // }
}


