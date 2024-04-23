const express = require("express");
const postStudent = require("./controllers/students.controller.js");

const app = express();

app.use(express.json());

app.post("/students", postStudent);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found." });
});

module.exports = app;
