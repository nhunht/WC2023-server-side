const Nations = require("../models/nation");
const isoCountries = require("i18n-iso-countries");
isoCountries.registerLocale(require("i18n-iso-countries/langs/en.json"));

class NationController {
  async index(req, res, next) {
    let pageSize = req.query.pageSize || 6;
    let pageIndex = req.query.pageIndex || 1;
    let search = req.query.search || "";
    let count = await Nations.countDocuments({ name: { $regex: search } });
    let nations = await Nations.find({ name: { $regex: search } })
      .sort({ createdAt: 1 })
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize);

    res.send(
      JSON.stringify({
        title: "Nations",
        pageIndex: pageIndex,
        totalPages: Math.ceil(count / pageSize),
        nations: nations,
        // button: req.isAuthenticated() ? "Logout" : "Login",
        // isAdmin: req.user.isAdmin ? "" : "hidden",
      })
    );
  }

  create(req, res, next) {
    const nation = new Nations(req.body);
    nation.ensign =
      "https://flagcdn.com/160x120/" +
      isoCountries.getAlpha2Code(nation.name, "en").toLowerCase() +
      ".png";
    nation
      .save()
      .then(() => res.send(JSON.stringify(nation)))
      .catch(next);
  }

  formEdit(req, res, next) {
    const nationId = req.params.nationId;
    Nations.findById(nationId)
      .then((nation) => {
        res.send(
          JSON.stringify({
            title: "The detail of Nation",
            nation: nation,
          })
        );
      })
      .catch(next);
  }

  edit(req, res, next) {
    var code = isoCountries.getAlpha2Code(req.body.name, "en").toLowerCase();
    req.body.ensign = "https://flagcdn.com/160x120/" + code + ".png";
    Nations.updateOne(
      {
        _id: req.params.nationId,
      },
      req.body
    )
      .then(() => res.sendStatus(204))
      .catch(next);
  }

  delete(req, res, next) {
    Nations.deleteOne(
      {
        _id: req.params.nationId,
      },
      req.body
    )
      .then(() => res.sendStatus(204))
      .catch(next);
  }
}
module.exports = new NationController();
