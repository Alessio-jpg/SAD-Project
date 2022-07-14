class Game {
    constructor(id, users) {
      this.id = id;
      this.users = users;

      this.scores = [];   
      this.users.forEach(u => {
        this.scores[u.uuid] = 0
      });
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

    getPlayerScore(player_uuid) {
        return this.scores[player_uuid];
    }

    incrementPlayerScore(player_uuid) {
        this.scores[player_uuid] += 1;
        return this.scores[player_uuid];
    }

    getGameRoom() {
        return "game-room_" + this.id;
    }
  }


  module.exports = Game // 👈 Export class