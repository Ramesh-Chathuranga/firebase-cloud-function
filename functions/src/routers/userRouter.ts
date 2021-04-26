import * as express  from "express";
// import * as admin from "firebase-admin";

// const db: any = admin.firestore();

interface Card {
number:Number,
year:Number,
month: Number,
expDate: Number,
nameOnCard: Number,
}

const router = express.Router();
router.post("/addCard", (req: any, res: any, next: any) => {

const body: Card = req.body;
res.status(200).send({...body})
   });


   export default router;