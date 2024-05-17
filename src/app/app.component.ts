import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CapyCardComponent } from './capy-card/capy-card.component';
import { NgFor } from '@angular/common';
import { ProposalsComponent } from './proposals/proposals.component';
import { ProfileRowComponent } from './profile-row/profile-row.component';
import { FriendboxComponent } from './friendbox/friendbox.component';
import { MatIconModule } from '@angular/material/icon';
import { MdbOnboardingModule } from '../../mdb5-ng/zips/MDB5-ANGULAR-UI-KIT-Pro-Advanced/code/plugins/mdb-angular-onboarding/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CapyCardComponent, ProposalsComponent, ProfileRowComponent, FriendboxComponent, MatIconModule, MdbOnboardingModule, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  hamsterTexts = [
    'Mein Name ist Carlos und ich bin sehr müde',
    'Ich bin Horst und fresse gerne Gras.',
    'Hallo, ich bin Frederik das Capybara.',
    'Hey, bist du auch ein Capybara?'
  ]

  images = [
    'assets/img/capybara1.jpg',
    'assets/img/capybara2.jpg',
    'assets/img/capybara3.jpg',
    'assets/img/capybara4.jpg',
  ]
}
