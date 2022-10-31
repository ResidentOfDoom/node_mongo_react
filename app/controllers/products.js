const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authorization');
const { MongoClient, ObjectId} = require('mongodb');

// enonoume tin database 
const url = 'mongodb://mongo:27017';    //dinoume url gia na kserei pou na stelnei kai na pairnei dedomena
const client = new MongoClient(url);    // dimiourgoume tin database
const projectDBName = 'apothiki';       // kai tin onomazoume

// dimiourgise kainourio product
router.post('/product', authenticateToken, async (req, res) => {
    await client.connect();
    const db = client.db(projectDBName);
    const collection = db.collection('products');
    const insertResult = await collection.insertOne({ barcode: req.body?.barcode, description: req.body?.description, condition: req.body?.condition, master: req.body?.master, producer: req.body.producer});
    console.log(insertResult);
    var message = insertResult.acknowledged? {created: true} : {created: false};
    res.json(message);
  });
  
  
  // deikse mou ola ta iparxonta products
  router.get('/product/all', authenticateToken, async (req, res) => {
    await client.connect();
    const db = client.db(projectDBName);
    const collection = db.collection('products');
    const Result = await collection.find();
    res.json(await Result.toArray());
  });
  
  
  // deikse mou ena sigkekrimeno product
  router.get('/product/:productId', authenticateToken, async (req, res) => {
    await client.connect();
    const db = client.db(projectDBName);
    const collection = db.collection('products');
    const Result = await collection.findOne({_id: ObjectId(req.params.productId)});
    res.json(Result);
  });
  
  
  // allakse kati se ena sigkekrimeno product
  router.put('/product/:productId', authenticateToken, async (req, res) => {
    await client.connect();
    const db = client.db(projectDBName);
    const collection = db.collection('products');
    const Result = await collection.findOne({_id: ObjectId(req.params.productId)});
    if(Result?._id && req?.body){
      for(var key in req.body){
        Result[key]=req.body[key];
      }
    }
    delete Result._id; // Giati diagrafoume to Result._id?
    await collection.updateOne({_id: ObjectId(req.params.productId)}, {$set:Result});
    res.json(Result);
  });
  
  
  // svise ena sigkekrimeno product
  router.delete('/product/:productId', authenticateToken, async (req, res) => {
    await client.connect();
    const db = client.db(projectDBName);
    const collection = db.collection('products');
    const Result = await collection.findOne({_id: ObjectId(req.params.productId)});
    const deleteResult = await collection.deleteOne(Result);
    res.json(await deleteResult.deletedCount);
  });

  module.exports = router;

