const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');


dotenv.config(); // me auton ton tropo fernoume to arxeio .env stin efarmogi mas gia na mporoume na exoume prosvasi kai na vroume to TOKEN_SIGNATURE meso tou process.env.TOKEN_SIGNATURE
function generateAccessToken(user) { // dimiourgoume JSON Web Token pou tha xrisimopoiithei gia to authentication
  delete user.password;              // svinoume to password gia na min mporei kapoios na to vrei meso tou token
  return jwt.sign(user, process.env.TOKEN_SIGNATURE, { expiresIn: '1800s' }); // edo ginetai i ipografi tou token me ton ekastote user sin to TOKEN_SIGNATURE gia na einai monadiko to token
}

// function gia tin epivevaiosi oti to token pou mas esteile o client einai authentiko
function authenticateToken(req, res, next) { 
  const authHeader = req.headers['authorization']; // apothikeuei to bearer token sto authHeader gia na ksexorisei to token meta
  const token = authHeader && authHeader.split(' ')[1] ? authHeader.split(' ')[1] : null; // elegxei an iparxei bearer alla kai token(eksou kai to split(' '))[1]. allos tropos einai to authHeader?.split(' ')?.[1]

  if (token == null) { 
    return res.sendStatus(401) // error message
  };

  //an to token tou client exei tin sosti ipografi tote pairnoume ta stoixeia tou user kai ta vazoume sto req.user alla giati?????????????????????
  jwt.verify(token, process.env.TOKEN_SIGNATURE, (err, user) => { 
    console.log(err);

    if (err) {
      return res.sendStatus(403) // an den einai sosti i ipografi vgazei error
    };

    req.user = user;

    next(); // auto xreiazetai gia na sinexisei i efarmogi kai na min stamatisei sto req.user = user
  });
}