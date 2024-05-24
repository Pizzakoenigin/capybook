import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ProposalsComponent } from '../proposals/proposals.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, ProposalsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

}
