import db from "../models/index.js";

db.User.findOne({
  attributes: ["login_id"],
  where: {
    login_id: "test",
  },
}).then((result) => console.log(result));
