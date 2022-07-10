class Game {
    constructor(id, users) {
      this.id = id;
      this.users = users;
    }

    isPlayerPresent(player_uuid) {
        var found = false;
        this.users.forEach(u => {
            if(u.uuid === player_uuid) {
                found = true;
            }
        });
        return found;
    }

    getGameRoom() {
        return "game-room_" + this.id;
    }
  }


  module.exports = Game // 👈 Export class