const express = require("express");
const { PORT } = require("./config");
const connect = require("./db");
const router = require("./routes");
const app = express();
const port = PORT;
app.use('/v1', router)
app.listen(port, () => {
  console.log("Server is listening on port =", port);
 connect();
});
