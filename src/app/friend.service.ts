import { Injectable } from "@angular/core";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})

export class FriendService {

    constructor(public dataService: DataService) {}

addFriend(capybaras, i) {
    capybaras[0].friends.push(capybaras[i] )
    capybaras[i].canFollow=false;
    this.dataService.friendListLength = capybaras[0].friends.length+2
  }
}
