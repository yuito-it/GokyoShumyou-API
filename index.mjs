import express from "express";
import http from "http";
import fs from "fs";
import { Deta } from "deta";
require('dotenv').config();

const deta = Deta(process.env.PROJECT_ID);
const db = deta.Base('UserData');

const app = express();
app.use(express.json());

app.get('/v1/waitinglist'(req,res)=>{
    res.status(200).json();
});
app.post('/v1/waitinglist'(req,res)=>{
});

const webServer = http.createServer(app);
webServer.listen(3000,()=>{
  console.log("server running PORT:"+3000);
});