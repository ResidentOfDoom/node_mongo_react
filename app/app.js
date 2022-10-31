// dilonoume sto programma osa xreiazetai na fortosei apo piso gia na treksei auta pou theloume na kanoume
const express = require('express');
const { MongoClient, ObjectId} = require('mongodb');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const users = require('./controllers/users.js');

// xrisimopoioume tin express kai dilonoume poia paketa apo autin tha xrisimopoiisoume pio kato
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enonoume tin database 
const url = 'mongodb://mongo:27017';    //dinoume url gia na kserei pou na stelnei kai na pairnei dedomena
const client = new MongoClient(url);    // dimiourgoume tin database
const projectDBName = 'apothiki';       // kai tin onomazoume


// get config vars
dotenv.config(); // me auton ton tropo fernoume to arxeio .env stin efarmogi mas gia na mporoume na exoume prosvasi kai na vroume to TOKEN_SIGNATURE meso tou process.env.TOKEN_SIGNATURE
function generateAccessToken(user) { // dimiourgoume JSON Web Token pou tha xrisimopoiithei gia to authentication
  delete user.password;              // svinoume to password gia na min mporei kapoios na to vrei meso tou token
  return jwt.sign(user, process.env.TOKEN_SIGNATURE, { expiresIn: '1800s' }); // edo ginetai i ipografi tou token me ton ekastote user sin to TOKEN_SIGNATURE gia na einai monadiko to token
}

// function gia tin epivevaiosi oti to token pou mas esteile o client einai authentiko
function authenticateToken(req, res, next) { 
  const authHeader = req.headers['authorization']; // apothikeuei to bearer token sto authHeader gia na ksexorisei to token meta
  const token = authHeader && authHeader.split(' ')[1] ? authHeader.split(' ')[1] : null; // elegxei an iparxei bearer alla kai token(eksou kai to split). allos tropos einai to authHeader?.split(' ')?.[1]

  if (token == null) { 
    return res.sendStatus(401) // error message
  };

  //an to token tou client exei tin sosti ipografi tote pairnoume ta stoixeia tou user kai ta vazoume sto req.user gia na kseroume ana pasa stigmi gia poion user einai to session
  jwt.verify(token, process.env.TOKEN_SIGNATURE, (err, user) => { 
    console.log(err);

    if (err) {
      return res.sendStatus(403) // an den einai sosti i ipografi vgazei error
    };

    req.user = user;

    next(); // auto xreiazetai gia na sinexisei i efarmogi kai na min stamatisei sto req.user = user
  });
}

// se poia porta apantaei i efarmogi
const port = process.env.PORT || 3000; 


// o client stelnei ena username ston server
app.post('/token', async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('users');
  const Result = await collection.findOne({ username: req.body.username }); 
  let token = null;
  if(Result?.username == req.body.username && Result?.password == req.body.password ){ // kai an to username kai to password einai sosta
    token = generateAccessToken(Result);                                               // dimiourgise ena token
  }
  const message = token==null? {error: "unauthorised"} : {token: token};               // pes mou ti egine tlk
  res.json(message);
});

// Methods for User

// dimiourgia kainouriou user
app.post('/user', async (req, res) => {
  await client.connect();                                                                                        //sindesou me ton client
  const db = client.db(projectDBName);                                                                           //sindese client me tade database
  const collection = db.collection('users');                                                                     //theloume tin tade collection apo tin database
  const insertResult = await collection.insertOne({ username: req.body.username, password: req.body.password }); //kataxorise stin database auta ta stoixeia
  var message = insertResult.acknowledged? {created: true} : {created: false};                                   //deikse mou meso tou message an egine i oxi i kataxorisi 
  res.json(message);
});


// deikse mou olous tous grammenous users
app.get('/user/all', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('users');
  const Result = await collection.find();
  res.json(await Result.toArray());
});


// deikse mou enan sigkekrimeno user
app.get('/user/:userId', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('users');
  const Result = await collection.findOne({_id: ObjectId(req.params.userId)});
  res.json(Result);
});


// allakse kati se enan sigkekrimeno user
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


// diegrapse enan sigkekrimeno user
app.delete('/user/:userId', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('users');
  const Result = await collection.findOne({_id: ObjectId(req.params.userId)});
  const deleteResult = await collection.deleteOne(Result);
  res.json(await deleteResult.deletedCount);
});


/* Methods for Products */


// dimiourgise kainourio product
app.post('/product', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('products');
  const insertResult = await collection.insertOne({ barcode: req.body?.barcode, description: req.body?.description, condition: req.body?.condition, master: req.body?.master, producer: req.body.producer});
  console.log(insertResult);
  var message = insertResult.acknowledged? {created: true} : {created: false};
  res.json(message);
});


// deikse mou ola ta iparxonta products
app.get('/product/all', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('products');
  const Result = await collection.find();
  res.json(await Result.toArray());
});


// deikse mou ena sigkekrimeno product
app.get('/product/:productId', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('products');
  const Result = await collection.findOne({_id: ObjectId(req.params.productId)});
  res.json(Result);
});


// allakse kati se ena sigkekrimeno product
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


// svise ena sigkekrimeno product
app.delete('/product/:productId', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('products');
  const Result = await collection.findOne({_id: ObjectId(req.params.productId)});
  const deleteResult = await collection.deleteOne(Result);
  res.json(await deleteResult.deletedCount);
});

/* Methods for Position */


// dimiourgise mia kainouria thesi
app.post('/position', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('positions');
  const insertResult = await collection.insertOne({ building: req.body?.building, corridor: req.body?.corridor, subcorridor: req.body.subcorridor, position: req.body?.position, level: req.body?.level, occupied: req.body?.occupied});
  var message = insertResult.acknowledged? {created: true} : {created: false};
  res.json(message);
});


// deikse mou oles tis theseis
app.get('/position/all', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('positions');
  const Result = await collection.find();
  res.json(await Result.toArray());
});


// deikse mou mia sigkekrimeni thesi
app.get('/position/:positionId', authenticateToken, async (req, res) => {
  await client.connect();
  const db = client.db(projectDBName);
  const collection = db.collection('positions');
  const Result = await collection.findOne({_id: ObjectId(req.params.positionId)});
  res.json(Result);
});


// allakse kati se mia sigkekrimeni thesi
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


//svise mia sigkekrimeni thesi
app.delete('/position/:positionId', authenticateToken, async (req, res) => {
  await client.connect;
  const db = client.db(projectDBName);
  const collection = db.collection('positions');
  const Result = await collection.findOne({_id: ObjectId(req.params.positionId)});
  const deletedResult = await collection.deleteOne(Result);
  res.json(await deletedResult.deletedCount);
});


// i efarmogi akouei stin tade porta
app.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);

