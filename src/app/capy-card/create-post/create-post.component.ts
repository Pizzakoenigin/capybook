import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  showInput: boolean = false

  createInput() {
    this.showInput = !this.showInput
  }
}
