import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FriendService } from '../friend.service';

@Component({
  selector: 'app-friendbox',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './friendbox.component.html',
  styleUrl: './friendbox.component.scss'
})
export class FriendboxComponent {
  @Input() canFollow = true;
  constructor(public fs: FriendService) {

  }

}
