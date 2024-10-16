import { CommonModule, NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    NgIf,
    // HostListener
  ],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.scss'
})
export class BackToTopComponent {
  isScrolled: boolean = false;

  @HostListener("window:scroll")

  onWindowScroll() {
    if (window.scrollY > 50) {
      this.isScrolled = true
    }

    if (window.scrollY < 50) {
      this.isScrolled = false
    }
  }

  backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
