import { Component} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
  
})




export class AppComponent {

  constructor() {
    
  }
}
