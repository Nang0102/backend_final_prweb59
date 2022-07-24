const express = require("express");
const bcrypt = require("bcrypt");
const { db } = require("../db");
const userRouter = express.Router();

userRouter.post("/sign-up", async (req, res) => {
  const { email, username, password } = req.body;
  const saltRounds = 10;
  await bcrypt.hash(password, saltRounds, async function (err, hash) {
    const respond = await db.users.insertOne({
      email,
      username,
      password: hash,
    });

    res.status(201);
    res.json(respond);
    if (err) {
      res.status(500);
      res.json(err);
    }
  });
  return;
});

userRouter.post("/login", async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameters!",
    });
  }

  let userData = await handleUserLogin(email, username, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {}
  });
});

let handleUserLogin = async (email, username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.users.findOne({
          email,
        });
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check && username === user.username) {
            userData.errCode = 0;
              userData.errMessage = "ok";
              delete user.password
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong username or password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User's not found";
          resolve();
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = "Email is not existed";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.users.findOne({ email: userEmail });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = userRouter;

