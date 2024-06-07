import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { on } from "events";

@Injectable({
  providedIn: 'root'
})

export class FriendService {

  constructor(public dataService: DataService) { }

  addFriend(capybaras, i) {
    capybaras[0].friends.push(capybaras[i])
    capybaras[i].canFollow = false;

    capybaras[i].friends.push(capybaras[0])

    this.dataService.friendListLength = capybaras[0].friends.length + 2
  }

  removeFriend(capybaras, i) {
    for (let k = 0; k < capybaras[0].friends.length; k++) {
      if (capybaras[0].friends[k].id == i) {
        capybaras[0].friends.splice(k, 1)
      }

    }



    // remove user(me) from the other capybaras friend list

    // get id from the capy i clicked on 

    // remove capy with the id=0 (me) from the capy's friendlist


    for (let j = 0; j < capybaras[i].friends.length; j++) {
      if (capybaras[i].friends[j].id == 0) {
        capybaras[i].friends.splice(j, 1)
      }
    }


  capybaras[i].canFollow = true;

    this.dataService.friendListLength = capybaras[0].friends.length + 2
  }

}

