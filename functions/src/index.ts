import * as functions from "firebase-functions";
import * as express from "express";
 import  Routers from "./routers";

const app = express()

app.use(Routers)
exports.app = functions.https.onRequest(app)

