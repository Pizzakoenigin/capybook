
import { Component } from '@angular/core';
import { ProfileChildComponent } from './profile-child/profile-child.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        ProfileChildComponent,
        RouterOutlet
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})

export class ProfileComponent{

    



}
