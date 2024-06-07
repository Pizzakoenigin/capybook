import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { on } from "events";

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

    console.log(i);
    
    console.log(capybaras[i].friends);
    
    // console.log(capybaras[this.dataService.profileIndex].id); //0 because the user is always me




    // get id from the capy i clicked on

    // remove capy with the id=0 (me) from the capy's friendlist




    // capybara[i].friends.splice



    // capybaras[i].friends = capybaras[i].friends.filter(friend => friend.capybaras.id !== 0);


     

    // capybaras[i].friends = capybaras[i].friends.filter(capybaras[i].friends.capybaras.id !== 0)
    
    // capybaras[i].friends = capybaras[i].friends.filter(friend => friend !== capybaras[0])


    // const findOwnCapybaraIndex = capybaras[i].friends.findIndex(friend => friend === capybaras[0]);

    // capybaras[i].friends.splice(findOwnCapybaraIndex, 1)

    // capybaras[i].friends.splice(capybaras[i].friends.indexOf(capybaras[0]), 1);

    


    // capybaras[i].friends = capybaras[i].friends.filter(friend => friend !== capybaras[0]);

    this.dataService.friendListLength = capybaras[0].friends.length+2
  }

}

