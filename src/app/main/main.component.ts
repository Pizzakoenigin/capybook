import { Component} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CapyCardComponent } from '../capy-card/capy-card.component';
import { NgFor } from '@angular/common';
import { ProposalsComponent } from '../proposals/proposals.component';
import { ProfileRowComponent } from '../profile-row/profile-row.component';
import { FriendboxComponent } from '../friendbox/friendbox.component';
import { MatIconModule } from '@angular/material/icon';
import { LikeService } from '../like.service';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, CapyCardComponent, ProposalsComponent, ProfileRowComponent, FriendboxComponent, MatIconModule, NgFor, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
  
})




export class MainComponent {

}
