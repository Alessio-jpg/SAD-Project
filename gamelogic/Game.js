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

    getWinners() {
        var winners = [];
        var winning_score = -1000;
        this.users.forEach(u => {
            if(winning_score < this.scores[u.uuid]) {
                winning_score = this.scores[u.uuid]
                winners = [u]
            }
            else if(winning_score == this.scores[u.uuid]) {
                winners.push(u)
            }
            
          });
        return winners;
    }
  }


  module.exports = Game // 👈 Export class