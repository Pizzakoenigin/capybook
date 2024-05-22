import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  // likes: number[] = []
  canLike: boolean = true
  constructor() { }

  addLike(cardIndex: number){
    // if (this.canLike){
      
      
    //   this.likes[cardIndex] = (this.likes[cardIndex] || 0) + 1;
    //   this.canLike = false
    // }
    
    // console.log(this.likes);
  }
}
