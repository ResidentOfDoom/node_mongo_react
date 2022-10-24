const express = require('express');
const { MongoClient, ObjectId} = require('mongodb');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const url = 'mongodb://mongo:27017';
const client = new MongoClient(url);
const projectDBName = 'apothiki';


// get config vars
dotenv.config();
function generateAccessToken(user) {
  delete user.password;
  return jwt.sign(user, process.env.TOKEN_SIGNATURE, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401)
  };

  jwt.verify(token, process.env.TOKEN_SIGNATURE, (err, user) => {
    console.log(err);

    if (err) {
      return res.sendStatus(403)
    };

    req.user = user;

    next();
  });
}

const port = process.env.PORT || 3000;

app.post('/token', async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('users');
  const Result = await collection.findOne({ username: req.body.username });
  let token = null;
  if(Result?.username == req.body.username && Result?.password == req.body.password ){
    token = generateAccessToken(Result);
  }
  const message = token==null? {error: "unauthorised"} : {token: token};
  res.json(message);
});



/* Methods for User */

app.post('/user', async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('users');
  const insertResult = await collection.insertOne({ username: req.body.username, password: req.body.password });
  console.log(insertResult);
  var message = insertResult.acknowledged? {created: true} : {created: false};
  res.json(message);
});

app.get('/user/all', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('users');
  const Result = await collection.find();
  res.json(await Result.toArray());
});

app.get('/user/:userId', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('users');
  const Result = await collection.findOne({_id: ObjectId(req.params.userId)});
  res.json(Result);
});

app.put('/user/:userId', authenticateToken, async (req, res) => {
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

app.delete('/user/:userId', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('users');
  const Result = await collection.findOne({_id: ObjectId(req.params.userId)});
  const deleteResult = await collection.deleteOne(Result);
  res.json(await deleteResult.deletedCount);
});

/* Methods for Products */

app.post('/product', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('products');
  const insertResult = await collection.insertOne({ barcode: req.body?.barcode, description: req.body?.description, condition: req.body?.condition, master: req.body?.master, producer: req.body.producer});
  console.log(insertResult);
  var message = insertResult.acknowledged? {created: true} : {created: false};
  res.json(message);
});

app.get('/product/all', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('products');
  const Result = await collection.find();
  res.json(await Result.toArray());
});

app.get('/product/:productId', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('products');
  const Result = await collection.findOne({_id: ObjectId(req.params.productId)});
  res.json(Result);
});

app.put('/product/:productId', authenticateToken, async (req, res) => {
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

app.delete('/product/:productId', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('products');
  const Result = await collection.findOne({_id: ObjectId(req.params.productId)});
  const deleteResult = await collection.deleteOne(Result);
  res.json(await deleteResult.deletedCount);
});

/* Methods for Position */

app.post('/position', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('positions');
  const insertResult = await collection.insertOne({ building: req.body?.building, corridor: req.body?.corridor, subcorridor: req.body.subcorridor, position: req.body?.position, level: req.body?.level, occupied: req.body?.occupied});
  var message = insertResult.acknowledged? {created: true} : {created: false};
  res.json(message);
});

app.get('/position/all', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('positions');
  const Result = await collection.find();
  res.json(await Result.toArray());
});

app.get('/position/:positionId', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('positions');
  const Result = await collection.findOne({_id: ObjectId(req.params.positionId)});
  res.json(Result);
});

app.put('/position/:positionId', authenticateToken, async (req, res) => {
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

app.delete('/position/:positionId', authenticateToken, async (req, res) => {
  await client.connect;
  const db = client.db(projectDBName);
  const collection = db.collection('positions');
  const Result = await collection.findOne({_id: ObjectId(req.params.positionId)});
  const deletedResult = await collection.deleteOne(Result);
  res.json(await deletedResult.deletedCount);
});

app.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);

