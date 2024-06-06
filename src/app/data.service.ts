import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    profileIndex: number = 0;
    friendCount: number = 0;
    friendListLength: number = 0; 
    initAddFriendsToCapies: boolean = true;
}