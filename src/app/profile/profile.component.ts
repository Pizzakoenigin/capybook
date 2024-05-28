import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { ProposalsComponent } from '../proposals/proposals.component';
import { FriendboxComponent } from '../friendbox/friendbox.component';
import { CAPYBARAS } from '../../mock-capybara';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { ProfileRowComponent } from '../profile-row/profile-row.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, ProposalsComponent, FriendboxComponent, ProfileRowComponent, RouterOutlet, RouterLink, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent{
  capybaras = CAPYBARAS

  dataI: any;
  subscription: Subscription;

  message: string;

  profileIndex: number;


  constructor(private route: ActivatedRoute, public dataService: DataService) {

    this.profileIndex = this.dataService.profileIndex;
  }

  ngOnInit(): void {
    this.profileIndex = 0
    this.route.params.subscribe(params => {
      this.dataI = params['id']
      console.log(this.dataI);
    })
  }




}
