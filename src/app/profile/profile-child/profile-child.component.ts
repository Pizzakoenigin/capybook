import { Component } from '@angular/core';
import { DataService } from '../../data.service';
import { FriendService } from '../../friend.service';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../../header/header.component';
import { ProposalsComponent } from '../../proposals/proposals.component';
import { FriendboxComponent } from '../../friendbox/friendbox.component';
import { CAPYBARAS } from '../../../mock-capybara';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { ProfileRowComponent } from '../../profile-row/profile-row.component';


@Component({
  selector: 'app-profile-child',
  standalone: true,
  imports: [HeaderComponent, 
    ProposalsComponent, 
    FriendboxComponent, 
    ProfileRowComponent,
    RouterOutlet, 
    RouterLink, 
    NgIf,
    CommonModule],
  templateUrl: './profile-child.component.html',
  styleUrl: './profile-child.component.scss'
})
export class ProfileChildComponent {

  capybaras = CAPYBARAS
  dataI: any;
  subscription: Subscription;
  message: string;
  profileIndex: number;

  constructor(private route: ActivatedRoute, public dataService: DataService, public friendService: FriendService) {
    this.profileIndex = this.dataService.profileIndex;
    dataService.onMainPage = false
  }

  ngOnInit(): void {
    this.profileIndex = 0
    this.route.params.subscribe(params => {
      this.dataI = params['id']
    })
  }

}
