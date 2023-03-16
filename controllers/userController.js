const bcrypt = require("bcrypt");
const User = require("../models/user");

class UserController {
  index(req, res, next) {
    let param = {};

    if (!req.body.isAdmin) {
      param = { username: req.body.username };
    }

    User.find(param)
      .then((users) => {
        res.send(
          JSON.stringify({
            title: "Users",
            users: users,
          })
        );
      })
      .catch(next);
  }

  signup(req, res, next) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    const user = new User(req.body);
    user
      .save()
      .then(() => res.send(JSON.stringify(user)))
      .catch(next);
  }

  formEdit(req, res, next) {
    const userId = req.params.userId;
    User.findById(userId)
      .then((user) => {
        res.send(
          JSON.stringify({
            title: "The detail of User",
            user: user,
          })
        );
      })
      .catch(next);
  }

  edit(req, res, next) {
    User.updateOne(
      {
        _id: req.params.userId,
      },
      req.body
    ).catch(next);
  }
}
module.exports = new UserController();
