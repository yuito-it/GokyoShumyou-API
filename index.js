const express = require("express");
const http =require("http");
const { Deta } = require("deta");
require("dotenv").config();
const moment = require("moment");

const deta = Deta();
const userData = deta.Base("UserData");
const waitinglist = deta.Base("waitinglist");

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("GokyouShumyouAPI V3\n status:ok");
});
app.post("/v1/signup", (req, res) => {
  userData.put(req.body);
  res.status(200).json({
    status: 200,
    message: "Registed! Username:" + req.body.name + "PW:" + req.body.PW
  });
  return;
});
app.post("/v1/waitinglist", (req, res) => {
  if (userData.fetch({ name: req.body.name, PW: req.body.name }).count == 0) {
    res.status(402).json({ status: 402, message: "Please confirm AuthData." });
    return;
  } else {
    waitinglist.put(req.body, {
      expireIn: 300
    });
    res.status(200).json({ status: 200, message: "Add waitinglist!" });
  }
});
app.delete("/v1/waitinglist", (req, res) => {
  if (waitinglist.fetch({ name: req.body.name, PW: req.body.PW }).count == 0) {
    res.status(402).json({ status: 402, message: "Please confirm AuthData." });
    return;
  } else {
    const { items: myFirstSet } = waitinglist.fetch({
      name: req.body.name,
      PW: req.body.PW
    });
    const key = myFirstSet[0].key;
    waitinglist.delete(key);
    res.status(200).json({ status: 200, message: "Delete waitinglist!" });
    return;
  }
});
app.get("/v1/waitinglist", (req, res) => {
  if (waitinglist.fetch({ name: req.body.name, PW: req.body.PW }).count == 0) {
    res.status(402).json({ status: 402, message: "Please confirm AuthData." });
    return;
  } else {
    const { items: toUD } = waitinglist.fetch({ kyuui: req.body.kyuui });
    delete toUD.PW;
    res.status(200).json(toUD);
    return;
  }
});
app.listen(port, () => {
  console.log(`GokyouShumyouAPI app listening on port ${port}`);
});
