const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authorization');
const { MongoClient, ObjectId} = require('mongodb');

// enonoume tin database 
const url = 'mongodb://mongo:27017';    //dinoume url gia na kserei pou na stelnei kai na pairnei dedomena
const client = new MongoClient(url);    // dimiourgoume tin database
const projectDBName = 'apothiki';       // kai tin onomazoume

// dimiourgise mia kainouria thesi
router.post('/position', authenticateToken, async (req, res) => {
    await client.connect();
    const db = client.db(projectDBName);
    const collection = db.collection('positions');
    const insertResult = await collection.insertOne({ building: req.body?.building, corridor: req.body?.corridor, subcorridor: req.body.subcorridor, position: req.body?.position, level: req.body?.level, occupied: req.body?.occupied});
    var message = insertResult.acknowledged? {created: true} : {created: false};
    res.json(message);
  });
  
  
  // deikse mou oles tis theseis
  router.get('/position/all', authenticateToken, async (req, res) => {
    await client.connect();
    const db = client.db(projectDBName);
    const collection = db.collection('positions');
    const Result = await collection.find();
    res.json(await Result.toArray());
  });
  
  
  // deikse mou mia sigkekrimeni thesi
  router.get('/position/:positionId', authenticateToken, async (req, res) => {
    await client.connect();
    const db = client.db(projectDBName);
    const collection = db.collection('positions');
    const Result = await collection.findOne({_id: ObjectId(req.params.positionId)});
    res.json(Result);
  });
  
  
  // allakse kati se mia sigkekrimeni thesi
  router.put('/position/:positionId', authenticateToken, async (req, res) => {
    await client.connect();
    const db = client.db(projectDBName);
    const collection = db.collection('positions');
    const Result = await collection.findOne({_id: ObjectId(req.params.positionId)});
    if(Result?._id && req?.body){
      for(var key in req.body){ 
        Result[key] = req.body[key];
      }
    }
    delete Result._id;
    await collection.updateOne({_id: ObjectId(req.params.positionId)}, {$set: Result});
    res.json(Result);
  });
  
  
  //svise mia sigkekrimeni thesi
  router.delete('/position/:positionId', authenticateToken, async (req, res) => {
    await client.connect;
    const db = client.db(projectDBName);
    const collection = db.collection('positions');
    const Result = await collection.findOne({_id: ObjectId(req.params.positionId)});
    const deletedResult = await collection.deleteOne(Result);
    res.json(await deletedResult.deletedCount);
  });

  module.exports = router;