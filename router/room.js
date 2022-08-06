const express = require("express");
const { db } = require("../db");
const { ObjectId } = require("mongodb");
const roomRouter = express.Router();

roomRouter.get("/", async (req, res) => {
  try {
    const id = req.headers.id;
    let room;
    if (id) {
      room = await db.rooms.findOne({ _id: new ObjectId(id) });
    } else {
      room = await db.rooms.find({}).toArray();
    }

    res.status(200);
    res.json(room);
  } catch (error) {
    res.status(500);
    res.json("some thing went wrong" + error);
  }
});

module.exports = roomRouter;
