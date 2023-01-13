require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

const User = new mongoose.model("User", userSchema);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });

  newUser.save((err) => {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.username }, (err, user) => {
    if (!err) {
      if (user.password === md5(req.body.password)) {
        res.render("secrets");
      }
    } else {
      console.log(err);
    }
  });
});
