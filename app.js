// app.js file in node js for back end with express
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/wc2023";
const connect = mongoose.connect(url);

connect.then(() => {
  console.log("Connected to MongoDB");
});

var indexRouter = require("./routes/indexRouter");
var usersRouter = require("./routes/userRouter");
var playerRouter = require("./routes/playerRouter");
var nationRouter = require("./routes/nationRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/home", indexRouter);
app.use("/api/user", usersRouter);
app.use("/api/players", playerRouter);
app.use("/api/nations", nationRouter);

const port = process.env.PORT || 8080;

app.listen(port);
