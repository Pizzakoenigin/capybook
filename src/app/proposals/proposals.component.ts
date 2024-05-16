import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProfileRowComponent } from '../profile-row/profile-row.component';

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [RouterOutlet, ProfileRowComponent, NgFor],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.scss'
})
export class ProposalsComponent {
  names = ['Patrick', 'Daniel', 'Rebecca', 'Peter']
  texts = ['taucht gerne', 'spielt', 'freundlich', 'haarig']
  images = ['assets/img/capybara5.jpg',
    'assets/img/capybara6.jpg',
    'assets/img/capybara7.jpg',
    'assets/img/capybara8.jpg'
  ]
}
