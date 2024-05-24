import { Component, OnInit } from '@angular/core';
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
export class ProfileComponent implements OnInit{
  capybaras = CAPYBARAS

  data: any;

  constructor(private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.data = params['id']
      console.log(this.data);
      
    })
  }
}
