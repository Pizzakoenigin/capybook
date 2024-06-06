import { Injectable } from "@angular/core";
import { DataService } from "./data.service";

@Injectable({
    providedIn: 'root'
})

export class FriendService {

    constructor(public dataService: DataService) {}

addFriend(capybaras, i) {
    // debugger
    capybaras[0].friends.push(capybaras[i])
    capybaras[i].canFollow=false;
    capybaras[i].friends.push(capybaras[0]);
    
    
    // console.log(capybaras[0]);
    
    
    this.dataService.friendListLength = capybaras[0].friends.length+2
  }

  removeFriend(capybaras, i) {
    debugger
    capybaras[0].friends.splice(i, 1)
    capybaras[i].canFollow=true
    // capybaras[i].friends.splice(capybaras[i].friends.indexOf(capybaras[0]), 1);

    this.dataService.friendListLength = capybaras[0].friends.length+2
  }

}

