import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { CAPYBARAS } from '../mock-capybara';
import { POSTS } from '../mock-posts';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  constructor() {
    CAPYBARAS[5].posts.push(POSTS[0]);
    CAPYBARAS[4].posts.push(POSTS[1]);
    CAPYBARAS[2].posts.push(POSTS[2]);
    CAPYBARAS[3].posts.push(POSTS[3])
  }
}
