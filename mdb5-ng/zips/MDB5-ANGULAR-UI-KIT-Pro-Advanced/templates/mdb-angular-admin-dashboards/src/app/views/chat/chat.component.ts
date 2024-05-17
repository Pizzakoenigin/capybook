import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MdbSidenavComponent } from 'mdb-angular-ui-kit/sidenav';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav!: MdbSidenavComponent;

  mode = window.innerWidth >= 1000 ? 'side' : 'over';
  hidden = window.innerWidth >= 1000 ? false : true;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize').subscribe(() => {
        if (window.innerWidth < 1000 && this.mode !== 'over') {
          this.ngZone.run(() => {
            this.mode = 'over';
            this.hideSidenav();
          });
        } else if (window.innerWidth >= 1000 && this.mode !== 'side') {
          this.ngZone.run(() => {
            this.mode = 'side';
            this.showSidenav();
          });
        }
      });
    });
  }

  hideSidenav() {
    setTimeout(() => {
      this.sidenav.hide();
    }, 0);
  }

  showSidenav() {
    setTimeout(() => {
      this.sidenav.show();
    });
  }
}
