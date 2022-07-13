class User {
    constructor(id, username, socket) {
      this.uuid = id;
      this.username = username;
      this.socket = socket;

      this.canSubmit = true;
    }
  }


  module.exports = User // 👈 Export class