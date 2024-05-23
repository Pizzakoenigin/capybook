import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CapyCardComponent } from './capy-card/capy-card.component';
import { NgFor } from '@angular/common';
import { ProposalsComponent } from './proposals/proposals.component';
import { ProfileRowComponent } from './profile-row/profile-row.component';
import { FriendboxComponent } from './friendbox/friendbox.component';
import { MatIconModule } from '@angular/material/icon';
import { LikeService } from './like.service';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CapyCardComponent, ProposalsComponent, ProfileRowComponent, FriendboxComponent, MatIconModule, NgFor, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
  
})




export class AppComponent {

  constructor(public ls: LikeService) {
    
  }
}
