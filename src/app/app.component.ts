import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CapyCardComponent } from './capy-card/capy-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CapyCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  hamsterTexts = [
    'Hallo, ich bin Frederik das Capybara.',
    'Ich bin Carlos.',
    'Ich fresse gerne Gras.',
    'Hey, bist du auch ein Capybara?'
  ]

  images = [
    'assets/img/capybara1.jpg',
    'assets/img/capybara2.jpg',
    'assets/img/capybara3.jpg',
    'assets/img/capybara4.jpg',
  ]
}
