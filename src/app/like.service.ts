import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  constructor() { }

  checkLiked(liked: boolean): boolean {
    liked = !liked
    return liked
  }

  addLike(likes: number, liked: boolean): number {
    if (!liked) {
      likes += 1;
    } else {
      likes -= 1
    }
    return likes;
  }
}
