import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-user-management-modal',
  templateUrl: './user-management-modal.component.html',
  styleUrls: ['./user-management-modal.component.scss'],
})
export class UserManagementModalComponent implements OnInit {
  modalTitle!: string;
  company!: string;
  office!: string;
  employees!: string;
  international!: string;

  options = [
    { value: 'London', label: 'London' },
    { value: 'Warsaw', label: 'Warsaw' },
    { value: 'New York', label: 'New York' },
  ];

  constructor(public modalRef: MdbModalRef<UserManagementModalComponent>) {}

  ngOnInit(): void {}

  saveData(): void {
    const closeMessage = {
      company: this.company,
      office: this.office,
      employees: this.employees,
      international: this.international,
    };

    this.modalRef.close(closeMessage);
  }
}
