import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  likes: number = 0
  canLike: boolean = true
  constructor() { }

  addLike(){
    if (this.canLike){
      this.likes += 1
      this.canLike = false
    }
    
    
  }
}
