import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { ProposalsComponent } from '../proposals/proposals.component';
import { FriendboxComponent } from '../friendbox/friendbox.component';
import { CAPYBARAS } from '../../mock-capybara';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, ProposalsComponent, FriendboxComponent, RouterOutlet, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent{
  capybaras = CAPYBARAS

  dataI: any;
  subscription: Subscription;

  message: string;

  sharedData: number;


  constructor(private route: ActivatedRoute, public dataService: DataService) {
    
    this.sharedData = this.dataService.sharedData;
  }

  ngOnInit(): void {
    this.sharedData = 0
    this.route.params.subscribe(params => {
      this.dataI = params['id']
      console.log(this.dataI);
    })
  }




}
