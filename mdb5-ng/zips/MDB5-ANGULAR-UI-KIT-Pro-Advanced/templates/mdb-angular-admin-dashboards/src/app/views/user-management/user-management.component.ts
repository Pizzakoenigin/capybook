import { Component, OnInit, ViewChild } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { UserManagementModalComponent } from 'src/app/shared/user-management-modal/user-management-modal.component';


export interface Person {
  company: string,
  office: string;
  employees: number,
  international: boolean;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  @ViewChild('table') table!: MdbTableDirective<Person>;

  modalRef!: MdbModalRef<UserManagementModalComponent>;

  newRow = {
    company: '',
    office: '',
    employees: 0,
    international: false,
  };

  headers = ['Company', 'Office', 'Employees', 'International'];

  dataSource: Person[] = [
    {
      company: 'Smith & Johnson',
      office: 'London',
      employees: 30,
      international: true,
    },
    {
      company: 'P.J. Company',
      office: 'London',
      employees: 80,
      international: false,
    },
    {
      company: 'Food & Wine',
      office: 'London',
      employees: 12,
      international: false,
    },
    {
      company: 'IT Service',
      office: 'London',
      employees: 17,
      international: false,
    },
    {
      company: 'A. Jonson Gallery',
      office: 'London',
      employees: 4,
      international: false,
    },
    {
      company: 'F.A. Architects',
      office: 'London',
      employees: 4,
      international: false,
    },
  ];

  constructor(private modalService: MdbModalService) {}

  ngOnInit() {}

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  openModal(mode: string, data?: Person) {
    this.modalRef = this.modalService.open(UserManagementModalComponent, { data: {
      modalTitle: mode === 'edit' ? 'Edit item' : 'New item',
      company: data ? data.company : '',
      office: data ? data.office : 'Warsaw',
      employees: data ? data.employees : 1,
      international: data ? data.international : false,
    }})

    this.modalRef.onClose.subscribe((modalData: Person) => {
      if (!modalData) {
        return;
      }

      if (mode === 'add') {
        this.dataSource = [...this.dataSource, {...modalData}];
      } else if (mode === 'edit' && data) {
        const index = this.dataSource.indexOf(data)

        this.dataSource[index] = modalData;
        this.dataSource = [...this.dataSource]
      }
    });
  }

  onDeleteClick(data: Person) {
    const index = this.dataSource.indexOf(data);
    this.dataSource.splice(index, 1);
    this.dataSource = [...this.dataSource]
  }

}
