addFriend(i) {
    this.capybaras[0].friends.push(this.capybaras[i] )
    this.dataService.friendListLength = this.capybaras[0].friends.length+2
  }