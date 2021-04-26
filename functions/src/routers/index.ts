import * as express from "express";
// import * as bodyParser from "body-parser";
import * as cors from "cors";
import UserDispatcher from "./userRouter";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
admin.initializeApp(functions.config().firebase);

const mainDispatcher = express.Router();
mainDispatcher.use(cors());
mainDispatcher.use(express.json());
mainDispatcher.use("/v1/user",UserDispatcher);

export default mainDispatcher;