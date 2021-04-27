import * as express from "express";
import * as _ from "lodash";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// const stripe = require('stripe')('sk_test_51Ikt7GIVKG0Cn57wk8U2xsh9cqjcG7aZzaN615hRoKZ5RwZu6PGrDxJuIr8SR0NsZDaei1GX9gGRE0ZH7kR4G6S700wWnYQXot');


admin.initializeApp(functions.config().firebase);
const db: any = admin.firestore();


interface Card {
    number: string,
    exp_year: Number,
    exp_month: Number,
    nameOnCard: string,
    isLive: boolean,
    cvv: string,
}

// const stripe = new Stripe('sk_test_51Ikt7GIVKG0Cn57wk8U2xsh9cqjcG7aZzaN615hRoKZ5RwZu6PGrDxJuIr8SR0NsZDaei1GX9gGRE0ZH7kR4G6S700wWnYQXot',{
//     apiVersion: '2020-08-27',
//   });

const router = express.Router();


router.delete("/removeCard", async (req: any, res: any, next: any) => {
    
  try{
    const body: any = req.body;
    const isLive = body.isLive;

    if (isLive) {
        var stripe = require('stripe')('sk_test_51Ikt7GIVKG0Cn57wk8U2xsh9cqjcG7aZzaN615hRoKZ5RwZu6PGrDxJuIr8SR0NsZDaei1GX9gGRE0ZH7kR4G6S700wWnYQXot');
    } else {
        var stripe = require('stripe')('sk_test_51Ikt7GIVKG0Cn57wk8U2xsh9cqjcG7aZzaN615hRoKZ5RwZu6PGrDxJuIr8SR0NsZDaei1GX9gGRE0ZH7kR4G6S700wWnYQXot');
    }
    const deleted = await stripe.customers.del(
        body.cusId
      );

      res.status(200).send({ deleted})

  }catch (error) {
    res.status(403).send({ message: "error occure", error })
}

});


router.post("/addCard", async (req: any, res: any, next: any) => {
    const body: Card = req.body;
    const isLive = body.isLive;

    if (isLive) {
        var stripe = require('stripe')('sk_test_51Ikt7GIVKG0Cn57wk8U2xsh9cqjcG7aZzaN615hRoKZ5RwZu6PGrDxJuIr8SR0NsZDaei1GX9gGRE0ZH7kR4G6S700wWnYQXot');
    } else {
        var stripe = require('stripe')('sk_test_51Ikt7GIVKG0Cn57wk8U2xsh9cqjcG7aZzaN615hRoKZ5RwZu6PGrDxJuIr8SR0NsZDaei1GX9gGRE0ZH7kR4G6S700wWnYQXot');
    }

    const docPath = req.query.id;

    try {
        const doc = await db
            .collection('users')
            .doc(docPath)
            .get();

        let data = {}
        if (doc.exists) {
            const params = doc.data();
            data = { id: doc.id, ...params };
        }
        if (!_.isNull(_.get(data, 'id', null))) {

            let cardList = _.get(data,'paymentCards',[]);
              
            // const isExist = _.findIndex(cardList,item=> item.)

            
            let token = await stripe.tokens.create({
                card: {
                    number: body.number,
                    exp_month: body.exp_month,
                    exp_year: body.exp_year,
                    cvc: body.cvv,
                },
            });


            const customer = await stripe.customers.create({
                description: 'Askdoc api customer',
                source: token.id,
            });

            let customerData = {...customer,card: {...token, card: {...token.card, nameOnCard: body.nameOnCard}}}
            customerData = _.pickBy(customerData,_.identity)
           cardList = [...cardList, customerData]

           await db.collection('users')
          .doc(docPath)
            .update({
               cardList
            })
        
            const docNew = await db
            .collection('users')
            .doc(docPath)
            .get();
            if (docNew.exists) {
                const params = docNew.data();
                data = { id: docNew.id, ...params };
            }
            
            res.status(200).send({ data, customer})
        } else {
            res.status(403)
        }
    } catch (error) {
        res.status(403).send({ message: "error occure", error })
    }






});


export default router;