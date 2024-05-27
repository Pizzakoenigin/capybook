import { Component, OnDestroy, OnInit } from '@angular/core';
import { FriendService } from '../friend.service';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProfileRowComponent } from '../profile-row/profile-row.component';
import { CAPYBARAS } from '../../mock-capybara';

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [RouterOutlet, RouterLink, ProfileRowComponent, NgFor, NgIf],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.scss'

  
})



export class ProposalsComponent implements OnInit, OnDestroy{
  
  message: string;
  subscription: Subscription;

  capybaras = CAPYBARAS

  constructor(public fs:FriendService, private data: DataService) {

  }

  ngOnInit() {
    this.subscription = this.data.currentMessage.subscribe(message => this.message = message)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
