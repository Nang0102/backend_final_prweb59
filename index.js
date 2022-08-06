const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { connectToDb, db } = require("./db");
const userRouter = require("./router/user");
const roomRouter = require("./router/room");
app.use(bodyParser.json({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.json("Hello world");
  console.log("database", db);
});

app.use("/user", userRouter);
app.use("/room", roomRouter);

app.listen(port, () => {
  console.log(`App is running on ${port}`);
  connectToDb();
});
