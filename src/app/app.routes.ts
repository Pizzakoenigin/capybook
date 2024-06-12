import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component'
import { ProfileComponent } from './profile/profile.component';
import { ProfileChildComponent } from './profile/profile-child/profile-child.component';

export const routes: Routes = [
    {path: '', component: MainComponent},
    {path: 'profile', component: ProfileComponent, children: [
        { path: 'profile/:username', component: ProfileChildComponent}
    ]}
];
