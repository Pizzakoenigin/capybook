import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { FriendService } from '../friend.service';
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

  constructor(public dataService: DataService, public friendService: FriendService) { }

  setprofileIndex() {
    this.dataService.profileIndex = 0;
  }





}


