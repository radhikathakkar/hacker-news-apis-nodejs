const mongoose = require("mongoose");
const { DB } = require("../config");

function connect() {
  mongoose.connect(DB.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("error", (err) => {
    throw new Error("Databse Connection Error");
  });

  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
  });
}

module.exports = connect;
