import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MdbCheckboxChange } from 'mdb-angular-ui-kit/checkbox';
import { MdbSidenavComponent } from 'mdb-angular-ui-kit/sidenav';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { fromEvent } from 'rxjs';

interface Email {
  sender: string;
  title: string;
  message: string;
  date: string;
}

@Component({
  selector: 'app-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss'],
})
export class MailboxComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav!: MdbSidenavComponent;
  @ViewChild('table', { static: true }) table!: MdbTableDirective<Email>;

  mode = window.innerWidth >= 1000 ? 'side' : 'over';
  hidden = window.innerWidth >= 1000 ? false : true;

  headers = ['Sender', 'Title', 'Message', 'Date'];

  dataSource: Email[] = [
    {
      sender: 'Vernon',
      title: 'libero. Proin mi. Aliquam',
      message:
        'et ipsum cursus vestibulum. Mauris magna. Duis dignissim tempor arcu.',
      date: '10.29.20',
    },
    {
      sender: 'Ashton',
      title: 'Donec porttitor tellus non',
      message:
        'augue, eu tempor erat neque non quam. Pellentesque habitant morbi',
      date: '11.19.20',
    },
    {
      sender: 'Amal',
      title: 'Nunc mauris elit, dictum',
      message:
        'elementum at, egestas a, scelerisque sed, sapien. Nunc pulvinar arcu',
      date: '03.14.21',
    },
    {
      sender: 'Rogan',
      title: 'magna. Duis dignissim tempor',
      message:
        'penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin',
      date: '12.13.20',
    },
    {
      sender: 'Vladimir',
      title: 'Donec nibh. Quisque nonummy',
      message: 'neque. In ornare sagittis felis. Donec tempor, est ac mattis',
      date: '03.25.21',
    },
    {
      sender: 'Ulric',
      title: 'est. Nunc ullamcorper, velit',
      message:
        'dui augue eu tellus. Phasellus elit pede, malesuada vel, venenatis',
      date: '12.06.20',
    },
    {
      sender: 'Hammett',
      title: 'netus et malesuada fames',
      message: 'eget metus eu erat semper rutrum. Fusce dolor quam, elementum',
      date: '07.17.21',
    },
    {
      sender: 'Gage',
      title: 'lectus pede et risus.',
      message: 'at fringilla purus mauris a nunc. In at pede. Cras',
      date: '11.24.20',
    },
    {
      sender: 'Damon',
      title: 'nec tempus scelerisque, lorem',
      message:
        'Suspendisse non leo. Vivamus nibh dolor, nonummy ac, feugiat non,',
      date: '02.17.21',
    },
    {
      sender: 'Travis',
      title: 'nisl elementum purus, accumsan',
      message: 'euismod mauris eu elit. Nulla facilisi. Sed neque. Sed eget',
      date: '09.12.20',
    },
    {
      sender: 'Drake',
      title: 'in consectetuer ipsum nunc',
      message: 'neque. In ornare sagittis felis. Donec tempor, est ac mattis',
      date: '12.08.20',
    },
    {
      sender: 'Finn',
      title: 'morbi tristique senectus et',
      message:
        'dolor, nonummy ac, feugiat non, lobortis quis, pede. Suspendisse dui.',
      date: '06.27.21',
    },
    {
      sender: 'Hedley',
      title: 'nisl arcu iaculis enim,',
      message:
        'Etiam laoreet, libero et tristique pellentesque, tellus sem mollis dui,',
      date: '02.10.21',
    },
    {
      sender: 'Ross',
      title: 'odio a purus. Duis',
      message:
        'diam dictum sapien. Aenean massa. Integer vitae nibh. Donec est',
      date: '03.14.21',
    },
    {
      sender: 'William',
      title: 'ut mi. Duis risus',
      message:
        'mus. Aenean eget magna. Suspendisse tristique neque venenatis lacus. Etiam',
      date: '04.16.21',
    },
    {
      sender: 'Brennan',
      title: 'per conubia nostra, per',
      message:
        'Nulla dignissim. Maecenas ornare egestas ligula. Nullam feugiat placerat velit.',
      date: '06.07.21',
    },
    {
      sender: 'Deacon',
      title: 'Nunc ullamcorper, velit in',
      message: 'Ut semper pretium neque. Morbi quis urna. Nunc quis arcu',
      date: '05.10.21',
    },
    {
      sender: 'Jameson',
      title: 'parturient montes, nascetur ridiculus',
      message:
        'Quisque libero lacus, varius et, euismod et, commodo at, libero.',
      date: '10.24.20',
    },
    {
      sender: 'Gareth',
      title: 'lobortis risus. In mi',
      message:
        'Aliquam ultrices iaculis odio. Nam interdum enim non nisi. Aenean',
      date: '08.15.21',
    },
    {
      sender: 'David',
      title: 'gravida sit amet, dapibus',
      message: 'non nisi. Aenean eget metus. In nec orci. Donec nibh.',
      date: '04.19.21',
    },
    {
      sender: 'Byron',
      title: 'metus. Aenean sed pede',
      message: 'ante. Vivamus non lorem vitae odio sagittis semper. Nam tempor',
      date: '11.18.20',
    },
    {
      sender: 'Ciaran',
      title: 'consectetuer euismod est arcu',
      message:
        'pellentesque a, facilisis non, bibendum sed, est. Nunc laoreet lectus',
      date: '07.22.21',
    },
    {
      sender: 'Gary',
      title: 'sem. Nulla interdum. Curabitur',
      message: 'consequat enim diam vel arcu. Curabitur ut odio vel est',
      date: '07.15.21',
    },
    {
      sender: 'Clark',
      title: 'Suspendisse sed dolor. Fusce',
      message: 'lorem ipsum sodales purus, in molestie tortor nibh sit amet',
      date: '06.09.21',
    },
    {
      sender: 'Lee',
      title: 'sed leo. Cras vehicula',
      message: 'Phasellus at augue id ante dictum cursus. Nunc mauris elit,',
      date: '06.24.21',
    },
    {
      sender: 'Isaiah',
      title: 'at fringilla purus mauris',
      message: 'dolor. Nulla semper tellus id nunc interdum feugiat. Sed nec',
      date: '05.28.21',
    },
    {
      sender: 'Todd',
      title: 'eu nibh vulputate mauris',
      message:
        'ultricies adipiscing, enim mi tempor lorem, eget mollis lectus pede',
      date: '08.17.21',
    },
    {
      sender: 'Nicholas',
      title: 'mollis lectus pede et',
      message:
        'dictum cursus. Nunc mauris elit, dictum eu, eleifend nec, malesuada',
      date: '03.02.21',
    },
    {
      sender: 'Wyatt',
      title: 'sodales elit erat vitae',
      message:
        'tincidunt dui augue eu tellus. Phasellus elit pede, malesuada vel,',
      date: '05.20.21',
    },
    {
      sender: 'Callum',
      title: 'ut, molestie in, tempus',
      message: 'eros turpis non enim. Mauris quis turpis vitae purus gravida',
      date: '03.24.21',
    },
    {
      sender: 'Neville',
      title: 'Aliquam erat volutpat. Nulla',
      message: 'nec enim. Nunc ut erat. Sed nunc est, mollis non,',
      date: '12.31.20',
    },
    {
      sender: 'Silas',
      title: 'congue. In scelerisque scelerisque',
      message:
        'tellus, imperdiet non, vestibulum nec, euismod in, dolor. Fusce feugiat.',
      date: '10.20.20',
    },
    {
      sender: 'Brenden',
      title: 'velit justo nec ante.',
      message: 'ante. Vivamus non lorem vitae odio sagittis semper. Nam tempor',
      date: '11.25.20',
    },
    {
      sender: 'Perry',
      title: 'Donec tempus, lorem fringilla',
      message:
        'cursus. Integer mollis. Integer tincidunt aliquam arcu. Aliquam ultrices iaculis',
      date: '09.23.20',
    },
    {
      sender: 'Gil',
      title: 'ac tellus. Suspendisse sed',
      message:
        'sodales at, velit. Pellentesque ultricies dignissim lacus. Aliquam rutrum lorem',
      date: '08.19.21',
    },
    {
      sender: 'Lester',
      title: 'aliquet lobortis, nisi nibh',
      message:
        'Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros.',
      date: '12.05.20',
    },
    {
      sender: 'Judah',
      title: 'aliquet. Phasellus fermentum convallis',
      message:
        'interdum. Curabitur dictum. Phasellus in felis. Nulla tempor augue ac',
      date: '10.20.20',
    },
    {
      sender: 'Xavier',
      title: 'ultrices. Duis volutpat nunc',
      message:
        'ornare, libero at auctor ullamcorper, nisl arcu iaculis enim, sit',
      date: '09.04.21',
    },
    {
      sender: 'Carson',
      title: 'mus. Aenean eget magna.',
      message:
        'id risus quis diam luctus lobortis. Class aptent taciti sociosqu',
      date: '04.07.21',
    },
    {
      sender: 'Kenyon',
      title: 'mauris a nunc. In',
      message:
        'lacinia vitae, sodales at, velit. Pellentesque ultricies dignissim lacus. Aliquam',
      date: '11.01.20',
    },
    {
      sender: 'Callum',
      title: 'neque venenatis lacus. Etiam',
      message: 'amet ante. Vivamus non lorem vitae odio sagittis semper. Nam',
      date: '08.25.21',
    },
    {
      sender: 'Judah',
      title: 'sed dui. Fusce aliquam,',
      message:
        'dis parturient montes, nascetur ridiculus mus. Proin vel nisl. Quisque',
      date: '12.03.20',
    },
    {
      sender: 'Gray',
      title: 'ligula. Nullam enim. Sed',
      message:
        'sit amet, consectetuer adipiscing elit. Aliquam auctor, velit eget laoreet',
      date: '10.05.20',
    },
    {
      sender: 'Arden',
      title: 'auctor. Mauris vel turpis.',
      message:
        'gravida. Praesent eu nulla at sem molestie sodales. Mauris blandit',
      date: '02.13.21',
    },
    {
      sender: 'Brody',
      title: 'justo. Praesent luctus. Curabitur',
      message:
        'pharetra, felis eget varius ultrices, mauris ipsum porta elit, a',
      date: '08.09.21',
    },
    {
      sender: 'Addison',
      title: 'interdum feugiat. Sed nec',
      message:
        'eros. Proin ultrices. Duis volutpat nunc sit amet metus. Aliquam',
      date: '09.19.20',
    },
    {
      sender: 'Price',
      title: 'luctus ut, pellentesque eget,',
      message:
        'Sed malesuada augue ut lacus. Nulla tincidunt, neque vitae semper',
      date: '12.17.20',
    },
    {
      sender: 'Merrill',
      title: 'amet ultricies sem magna',
      message: 'Phasellus ornare. Fusce mollis. Duis sit amet diam eu dolor',
      date: '04.28.21',
    },
    {
      sender: 'Brendan',
      title: 'odio, auctor vitae, aliquet',
      message:
        'ante blandit viverra. Donec tempus, lorem fringilla ornare placerat, orci',
      date: '02.26.21',
    },
    {
      sender: 'Stone',
      title: 'lacus pede sagittis augue,',
      message: 'mauris elit, dictum eu, eleifend nec, malesuada ut, sem. Nulla',
      date: '04.25.21',
    },
    {
      sender: 'Damian',
      title: 'a, facilisis non, bibendum',
      message: 'eget metus eu erat semper rutrum. Fusce dolor quam, elementum',
      date: '04.16.21',
    },
    {
      sender: 'Chandler',
      title: 'adipiscing. Mauris molestie pharetra',
      message: 'a, scelerisque sed, sapien. Nunc pulvinar arcu et pede. Nunc',
      date: '10.22.20',
    },
    {
      sender: 'Jonah',
      title: 'neque non quam. Pellentesque',
      message:
        'Fusce diam nunc, ullamcorper eu, euismod ac, fermentum vel, mauris.',
      date: '06.23.21',
    },
    {
      sender: 'Henry',
      title: 'fermentum convallis ligula. Donec',
      message:
        'habitant morbi tristique senectus et netus et malesuada fames ac',
      date: '04.21.21',
    },
    {
      sender: 'Zeus',
      title: 'Sed dictum. Proin eget',
      message: 'arcu. Morbi sit amet massa. Quisque porttitor eros nec tellus.',
      date: '09.03.20',
    },
    {
      sender: 'Eaton',
      title: 'Sed neque. Sed eget',
      message:
        'auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus',
      date: '05.26.21',
    },
    {
      sender: 'Tarik',
      title: 'ultrices a, auctor non,',
      message:
        'tristique senectus et netus et malesuada fames ac turpis egestas.',
      date: '11.19.20',
    },
    {
      sender: 'Carl',
      title: 'sem elit, pharetra ut,',
      message:
        'scelerisque scelerisque dui. Suspendisse ac metus vitae velit egestas lacinia.',
      date: '01.31.21',
    },
    {
      sender: 'Nathaniel',
      title: 'lacus. Quisque imperdiet, erat',
      message: 'luctus sit amet, faucibus ut, nulla. Cras eu tellus eu',
      date: '08.10.21',
    },
    {
      sender: 'Walker',
      title: 'dolor, tempus non, lacinia',
      message:
        'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur',
      date: '01.17.21',
    },
    {
      sender: 'Hilel',
      title: 'sapien. Nunc pulvinar arcu',
      message: 'ut cursus luctus, ipsum leo elementum sem, vitae aliquam eros',
      date: '09.27.20',
    },
    {
      sender: 'Trevor',
      title: 'Maecenas iaculis aliquet diam.',
      message: 'nunc. Quisque ornare tortor at risus. Nunc ac sem ut',
      date: '06.27.21',
    },
    {
      sender: 'Scott',
      title: 'Aliquam fringilla cursus purus.',
      message:
        'nunc, ullamcorper eu, euismod ac, fermentum vel, mauris. Integer sem',
      date: '07.12.21',
    },
    {
      sender: 'Knox',
      title: 'Lorem ipsum dolor sit',
      message:
        'sodales. Mauris blandit enim consequat purus. Maecenas libero est, congue',
      date: '09.26.20',
    },
    {
      sender: 'Kuame',
      title: 'eu, accumsan sed, facilisis',
      message: 'non, egestas a, dui. Cras pellentesque. Sed dictum. Proin eget',
      date: '03.05.21',
    },
    {
      sender: 'Stone',
      title: 'In condimentum. Donec at',
      message:
        'ac facilisis facilisis, magna tellus faucibus leo, in lobortis tellus',
      date: '05.04.21',
    },
    {
      sender: 'Curran',
      title: 'eu neque pellentesque massa',
      message:
        'penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec',
      date: '05.27.21',
    },
    {
      sender: 'Kennan',
      title: 'cursus luctus, ipsum leo',
      message:
        'posuere, enim nisl elementum purus, accumsan interdum libero dui nec',
      date: '06.14.21',
    },
    {
      sender: 'Kadeem',
      title: 'iaculis enim, sit amet',
      message:
        'et, lacinia vitae, sodales at, velit. Pellentesque ultricies dignissim lacus.',
      date: '03.27.21',
    },
    {
      sender: 'Carl',
      title: 'Aenean gravida nunc sed',
      message:
        'eget varius ultrices, mauris ipsum porta elit, a feugiat tellus',
      date: '10.26.20',
    },
    {
      sender: 'Nigel',
      title: 'consectetuer mauris id sapien.',
      message:
        'Fusce aliquam, enim nec tempus scelerisque, lorem ipsum sodales purus,',
      date: '10.20.20',
    },
    {
      sender: 'Alfonso',
      title: 'Cum sociis natoque penatibus',
      message:
        'dolor sit amet, consectetuer adipiscing elit. Curabitur sed tortor. Integer',
      date: '12.09.20',
    },
    {
      sender: 'Raja',
      title: 'neque vitae semper egestas,',
      message: 'augue id ante dictum cursus. Nunc mauris elit, dictum eu,',
      date: '11.26.20',
    },
    {
      sender: 'Axel',
      title: 'penatibus et magnis dis',
      message: 'felis eget varius ultrices, mauris ipsum porta elit, a feugiat',
      date: '11.02.20',
    },
    {
      sender: 'Kirk',
      title: 'risus. Donec egestas. Aliquam',
      message:
        'Suspendisse aliquet molestie tellus. Aenean egestas hendrerit neque. In ornare',
      date: '10.14.20',
    },
    {
      sender: 'Zachery',
      title: 'consectetuer adipiscing elit. Etiam',
      message:
        'Vivamus nisi. Mauris nulla. Integer urna. Vivamus molestie dapibus ligula.',
      date: '10.01.20',
    },
    {
      sender: 'Byron',
      title: 'dolor, nonummy ac, feugiat',
      message: 'sem elit, pharetra ut, pharetra sed, hendrerit a, arcu. Sed',
      date: '04.06.21',
    },
    {
      sender: 'Odysseus',
      title: 'in sodales elit erat',
      message: 'iaculis enim, sit amet ornare lectus justo eu arcu. Morbi',
      date: '12.08.20',
    },
    {
      sender: 'Stone',
      title: 'consectetuer adipiscing elit. Aliquam',
      message:
        'convallis, ante lectus convallis est, vitae sodales nisi magna sed',
      date: '04.13.21',
    },
    {
      sender: 'Bert',
      title: 'nec ante. Maecenas mi',
      message:
        'ultricies ornare, elit elit fermentum risus, at fringilla purus mauris',
      date: '11.29.20',
    },
    {
      sender: 'Reece',
      title: 'dictum sapien. Aenean massa.',
      message: 'eget metus eu erat semper rutrum. Fusce dolor quam, elementum',
      date: '09.05.20',
    },
    {
      sender: 'Bert',
      title: 'feugiat non, lobortis quis,',
      message: 'lorem eu metus. In lorem. Donec elementum, lorem ut aliquam',
      date: '08.23.21',
    },
    {
      sender: 'Nolan',
      title: 'aliquam adipiscing lacus. Ut',
      message:
        'mauris sapien, cursus in, hendrerit consectetuer, cursus et, magna. Praesent',
      date: '01.28.21',
    },
    {
      sender: 'Wesley',
      title: 'velit eget laoreet posuere,',
      message:
        'Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet',
      date: '09.11.20',
    },
    {
      sender: 'Baker',
      title: 'arcu. Vestibulum ut eros',
      message:
        'nulla. In tincidunt congue turpis. In condimentum. Donec at arcu.',
      date: '08.16.21',
    },
    {
      sender: 'Gannon',
      title: 'dictum mi, ac mattis',
      message:
        'Fusce aliquam, enim nec tempus scelerisque, lorem ipsum sodales purus,',
      date: '04.25.21',
    },
    {
      sender: 'Eric',
      title: 'Maecenas iaculis aliquet diam.',
      message:
        'aliquam iaculis, lacus pede sagittis augue, eu tempor erat neque',
      date: '03.26.21',
    },
    {
      sender: 'Moses',
      title: 'commodo auctor velit. Aliquam',
      message: 'lorem ut aliquam iaculis, lacus pede sagittis augue, eu tempor',
      date: '04.18.21',
    },
    {
      sender: 'Erasmus',
      title: 'Fusce feugiat. Lorem ipsum',
      message:
        'nec, cursus a, enim. Suspendisse aliquet, sem ut cursus luctus,',
      date: '08.26.21',
    },
    {
      sender: 'Stephen',
      title: 'nunc, ullamcorper eu, euismod',
      message: 'Mauris ut quam vel sapien imperdiet ornare. In faucibus. Morbi',
      date: '10.06.20',
    },
    {
      sender: 'Gary',
      title: 'In nec orci. Donec',
      message:
        'orci lobortis augue scelerisque mollis. Phasellus libero mauris, aliquam eu,',
      date: '04.25.21',
    },
    {
      sender: 'Herrod',
      title: 'diam. Proin dolor. Nulla',
      message:
        'ultricies ornare, elit elit fermentum risus, at fringilla purus mauris',
      date: '08.17.21',
    },
    {
      sender: 'Dustin',
      title: 'neque pellentesque massa lobortis',
      message: 'luctus felis purus ac tellus. Suspendisse sed dolor. Fusce mi',
      date: '03.27.21',
    },
    {
      sender: 'Melvin',
      title: 'semper erat, in consectetuer',
      message:
        'parturient montes, nascetur ridiculus mus. Donec dignissim magna a tortor.',
      date: '03.23.21',
    },
    {
      sender: 'Rajah',
      title: 'et, euismod et, commodo',
      message: 'ut odio vel est tempor bibendum. Donec felis orci, adipiscing',
      date: '04.21.21',
    },
    {
      sender: 'Chaney',
      title: 'sagittis. Nullam vitae diam.',
      message:
        'nibh dolor, nonummy ac, feugiat non, lobortis quis, pede. Suspendisse',
      date: '08.10.21',
    },
    {
      sender: 'Walker',
      title: 'a neque. Nullam ut',
      message: 'a tortor. Nunc commodo auctor velit. Aliquam nisl. Nulla eu',
      date: '11.22.20',
    },
    {
      sender: 'Silas',
      title: 'vitae, erat. Vivamus nisi.',
      message:
        'sit amet metus. Aliquam erat volutpat. Nulla facilisis. Suspendisse commodo',
      date: '12.15.20',
    },
    {
      sender: 'Colin',
      title: 'ac urna. Ut tincidunt',
      message:
        'fringilla est. Mauris eu turpis. Nulla aliquet. Proin velit. Sed',
      date: '03.22.21',
    },
    {
      sender: 'Jonah',
      title: 'lorem ac risus. Morbi',
      message: 'Curae; Phasellus ornare. Fusce mollis. Duis sit amet diam eu',
      date: '10.22.20',
    },
  ];

  selections = new Set<Email>();

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

  allRowsSelected() {
    return this.selections.size === this.dataSource.length;
  }

  toggleAll(event: MdbCheckboxChange): void {
    if (event.checked) {
      this.dataSource.forEach((row: Email) => {
        this.select(row);
      });
    } else {
      this.dataSource.forEach((row: Email) => {
        this.deselect(row);
      });
    }
  }

  toggleSelection(event: MdbCheckboxChange, value: Email) {
    if (event.checked) {
      this.select(value);
    } else {
      this.deselect(value);
    }
  }

  select(value: Email): void {
    if (!this.selections.has(value)) {
      this.selections.add(value);
    }
  }

  deselect(value: Email): void {
    if (this.selections.has(value)) {
      this.selections.delete(value);
    }
  }
}
