import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ProposalsComponent } from '../proposals/proposals.component';
import { FriendboxComponent } from '../friendbox/friendbox.component';
import { CAPYBARAS } from '../../mock-capybara';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, ProposalsComponent, FriendboxComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  capybaras = CAPYBARAS
}
