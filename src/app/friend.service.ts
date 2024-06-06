import { Injectable } from "@angular/core";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})

export class FriendService {

    constructor(public dataService: DataService) {}

addFriend(capybaras, i) {
    capybaras[0].friends.push(capybaras[i])
    capybaras[i].canFollow=false;
    capybaras[i].friends.push(capybaras[0])
    this.dataService.friendListLength = capybaras[0].friends.length+2
  }

  removeFriend(capybaras, i) {
    capybaras[0].friends.splice(i, 1)
    capybaras[i].canFollow=true;
    // capybaras[i].friends.splice(capybaras[i], 1)  

    // capybaras[i].friends.splice(capybaras[i].friends.indexOf(capybaras[0]), 1)  //removing the logged in user from the capyies friendlist by looking for the capy with the index 0 (the user)

    this.dataService.friendListLength = capybaras[0].friends.length+2
  }
}
