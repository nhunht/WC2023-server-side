const Players = require("../models/player");
const Nations = require("../models/nation");

let positionData = [
  {
    id: "1",
    name: "Goalkeeper",
  },
  {
    id: "2",
    name: "Midfielder",
  },
  {
    id: "3",
    name: "Right Backs",
  },
  {
    id: "4",
    name: "Left Backs",
  },
  {
    id: "8",
    name: "Wingers",
  },
];

class PlayerController {
  async index(req, res, next) {
    let pageSize = req.query.pageSize || 6;
    let pageIndex = req.query.pageIndex || 1;
    var players = await Players.find()
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize);
    var nations = await Nations.find();
    let count = await Players.countDocuments({});

    res.send(
      JSON.stringify({
        title: "Players",
        pageIndex: pageIndex,
        totalPages: Math.ceil(count / pageSize),
        players: players,
        nations: nations,
        positions: positionData,
        // button: req.isAuthenticated() ? 'Logout' : 'Login',
        // isAdmin: req.user.isAdmin ? '' : 'hidden',
      })
    );
  }

  create(req, res, next) {
    const player = new Players(req.body);
    player
      .save()
      .then(() => res.send(JSON.stringify(player)))
      .catch(next);
  }

  formEdit(req, res, next) {
    const playerId = req.params.playerId;
    Players.findById(playerId)
      .then((player) => {
        Nations.find({}).then((nations) => {
          res.send(
            JSON.stringify({
              title: "The detail of Player",
              player: player,
              nations: nations,
              positions: positionData,
            })
          );
        });
      })
      .catch(next);
  }

  edit(req, res, next) {
    Players.updateOne(
      {
        _id: req.params.playerId,
      },
      req.body
    )
      .then(() => {
        res.redirect("/players");
      })
      .catch(next);
  }

  delete(req, res, next) {
    Players.deleteOne(
      {
        _id: req.params.playerId,
      },
      req.body
    )
      .then(() => {
        res.redirect("/players");
      })
      .catch(next);
  }
}
module.exports = new PlayerController();