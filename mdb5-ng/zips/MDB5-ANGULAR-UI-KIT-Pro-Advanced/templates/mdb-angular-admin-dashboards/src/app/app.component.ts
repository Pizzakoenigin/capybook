import {
  Component,
  OnInit,
  AfterViewInit,
  NgZone,
  ViewChild,
} from '@angular/core';
import { MdbSidenavComponent } from 'mdb-angular-ui-kit/sidenav';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav!: MdbSidenavComponent;
  title = 'mdb-angular-admin-dashboards';

  mode = window.innerWidth >= 1400 ? 'side' : 'over';
  hidden = window.innerWidth >= 1400 ? false : true;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize').subscribe(() => {
        if (window.innerWidth < 1400 && this.mode !== 'over') {
          this.ngZone.run(() => {
            this.mode = 'over';
            this.hideSidenav();
          });
        } else if (window.innerWidth >= 1400 && this.mode !== 'side') {
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
