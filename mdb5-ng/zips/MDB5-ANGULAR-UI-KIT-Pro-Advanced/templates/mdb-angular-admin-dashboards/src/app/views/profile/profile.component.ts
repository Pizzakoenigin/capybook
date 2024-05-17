import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm = new UntypedFormGroup({
    name: new UntypedFormControl('John Doe'),
    email: new UntypedFormControl('johndoe@gmail.com'),
    position: new UntypedFormControl('Founder'),
    description: new UntypedFormControl(
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto ullam nihil impedit. Porro minus nemo nobis maiores numquam tempora architecto a, nisi consectetur, expedita illum, debitis aliquam incidunt molestias eveniet.'
    ),
  });

  constructor() {}

  ngOnInit(): void {}
}
