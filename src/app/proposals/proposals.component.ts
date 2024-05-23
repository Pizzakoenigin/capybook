import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProfileRowComponent } from '../profile-row/profile-row.component';
import { CAPYBARAS } from '../../mock-capybara';

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [RouterOutlet, ProfileRowComponent, NgFor],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.scss'
})
export class ProposalsComponent {
  capybaras = CAPYBARAS
}
