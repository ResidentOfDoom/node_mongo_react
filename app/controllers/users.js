const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authorization');
const { MongoClient, ObjectId} = require('mongodb');

// enonoume tin database 
const url = 'mongodb://mongo:27017';    //dinoume url gia na kserei pou na stelnei kai na pairnei dedomena
const client = new MongoClient(url);    // dimiourgoume tin database
const projectDBName = 'apothiki';       // kai tin onomazoume



module.exports = function usersMethods(){
    // dimiourgia kainouriou user
router.post('/user', async (req, res) => {
  await client.connect();                                                                                        //sindesou me ton client
  const db = client.db(projectDBName);                                                                           //sindese client me tade database
  const collection = db.collection('users');                                                                     //theloume tin tade collection apo tin database
  const insertResult = await collection.insertOne({ username: req.body.username, password: req.body.password }); //kataxorise stin database auta ta stoixeia
  var message = insertResult.acknowledged? {created: true} : {created: false};                                   //deikse mou meso tou message an egine i oxi i kataxorisi 
  res.json(message);
});


// deikse mou olous tous grammenous users
router.get('/user/all', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('users');
  const Result = await collection.find();
  res.json(await Result.toArray());
});


// deikse mou enan sigkekrimeno user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('users');
  const Result = await collection.findOne({_id: ObjectId(req.params.userId)});
  res.json(Result);
});


// allakse kati se enan sigkekrimeno user
router.put('/user/:userId', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('users');
  const Result = await collection.findOne({_id: ObjectId(req.params.userId)});
  if(Result?._id && req?.body){
    for(var key in req.body){
      Result[key]=req.body[key];
    }
  }
  delete Result._id;
  await collection.updateOne({_id: ObjectId(req.params.userId)}, {$set:Result});
  res.json(Result);
});


// diegrapse enan sigkekrimeno user
router.delete('/user/:userId', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('users');
  const Result = await collection.findOne({_id: ObjectId(req.params.userId)});
  const deleteResult = await collection.deleteOne(Result);
  res.json(await deleteResult.deletedCount);
});
};