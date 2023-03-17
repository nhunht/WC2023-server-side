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
    let search = req.query.search;
    let query = {};
    let count;

    if (search) {
      query = {
        name: { $regex: search, $options: "i" },
      };

      count = await Players.countDocuments(query);

      if (count === 0) {
        query = {
          $text: {
            $search: search,
            $caseSensitive: false,
            $diacriticSensitive: false,
          },
        };

        count = await Players.countDocuments(query);
      }
    }

    let players = await Players.find(query)
      .sort({ createdAt: 1 })
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize);
    let nations = await Nations.find();

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
      .then(() => res.sendStatus(204))
      .catch(next);
  }

  delete(req, res, next) {
    Players.deleteOne(
      {
        _id: req.params.playerId,
      },
      req.body
    )
      .then(() => res.sendStatus(204))
      .catch(next);
  }
}
module.exports = new PlayerController();
