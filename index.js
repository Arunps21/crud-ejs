const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const userModel = require("./models/userModel");
const { log } = require("console");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const mongoServer = () => {
  mongoose
    .connect("mongodb://localhost:27017/Crud_practice")
    .then(() => {
      console.log("Server connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error:", err);
    });
};
mongoServer();

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", async (req, res) => {
  const { name, email, image } = req.body;
  await userModel.create({
    name,
    email,
    image,
  });
  res.redirect("/read");
});

app.get("/read", async (req, res) => {
  let users = await userModel.find();
  res.render("read", { users });
});

app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await userModel.findOneAndDelete({ _id: id });
  res.redirect("/read");
});

app.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  let user = await userModel.findOne({ _id: id });
  res.render("edit", { user });
});

app.post("/update/:id", async (req, res) => {
    const { id } = req.params
  const { name, email, image } = req.body;
  await userModel.findOneAndUpdate({ _id : id }, {
    name,
    email,
    image
  });
  res.redirect("/read");
});

app.listen(3000, () => {
  console.log("Server run at http://localhost:3000");
});
