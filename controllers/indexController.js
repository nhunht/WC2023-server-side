const Players = require("../models/player");

class IndexController {
  async index(req, res, next) {
    let pageSize = req.query.pageSize || 6;
    let pageIndex = req.query.pageIndex || 1;
    let count = await Players.countDocuments({ isCaptain: true });

    Players.aggregate([
      {
        $match: { isCaptain: true },
      },
      {
        $lookup: {
          from: "nations",
          localField: "nationId",
          foreignField: "_id",
          as: "nation",
        },
      },
    ])
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .then((players) => {
        res.send(
          JSON.stringify({
            title: "Home Page",
            // button: req.isAuthenticated() ? "Logout" : "Login",
            pageIndex: pageIndex,
            totalPages: Math.ceil(count / pageSize),
            players: players,
          })
        );
      });
  }
}

module.exports = new IndexController();
