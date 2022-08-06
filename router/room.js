const express = require("express");
const bcrypt = require("bcrypt");
const { db } = require("../db");
const roomRouter = express.Router();

userRouter.get("/room", async (req, res) => {
  try {
  } catch (error) {}
  const respond = db.rooms.find({}).toArray(function (err, result) {
    if (err) throw err;
    console.log(result);
    res.status(200);
    res.json(result);
  });
  // console.log(respond);
});

module.exports = roomRouter;
