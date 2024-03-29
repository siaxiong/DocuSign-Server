require("dotenv").config({override: true});

const express = require("express");
const cors = require("cors");
const {verifyJwt} = require("./APIs/Strategy/verify_jwt");
const passport = require("passport");
const JWT_STRATEGY = require("./APIs/Strategy/JWT_STRATEGY");
const {createUserTuple} = require("./APIs/Unauthenticate/UserAPIs/userAPIs");
const fileAPIroutes = require("./APIs/Authenticate/FileAPIs/secureFileAPIs");
const userAPIroutes = require("./APIs/Authenticate/UserAPIs/secureUserAPIs");
const recipientAPIroutes = require("./APIs/Authenticate/RecipientAPIs/secureRecipientAPIs");
const {login, signup, confirmation} = require("./AWS/Cognito/congitoFunctions");
// createUserTuple({firstName: "sia2", lastName: "xiong", email: "siaxiong2@csus.edu"});
// createUserTuple({firstName: "sia52", lastName: "xiong", email: "siaxiong52@gmail.com"});
// createUserTuple({firstName: "sia23", lastName: "xiong", email: "siaxiong23@icloud.com"});
// createUserTuple({firstName: "siadev", lastName: "xiong", email: "siaxiongdev@gmail.com"});

const ASSOCIATIONS = require("./Database/Models/Associations");

// const sequelize = require("./Database/connection");
// sequelize.drop();



const app = express();
const PORT = 4500;

app.listen(PORT, ()=>console.log(`Port # is : ${PORT}`));


app.use(express.json());
app.use(cors());
passport.use(JWT_STRATEGY);

app.use("/api/db",
    passport.authenticate("jwt", {session: false}), fileAPIroutes);
app.use("/api/db",
    passport.authenticate("jwt", {session: false}), userAPIroutes);
app.use("/api/db",
    passport.authenticate("jwt", {session: false}), recipientAPIroutes);

app.post("/api/handleSignIn", async (req, res, next)=>{
    console.log("/api/handleSignIn");
    try {
        const payload = await login(req.body.email, req.body.password, next);
        verifyJwt(payload.jwt) ? res.send(payload) : res.send(null);
    } catch (error) {
        console.error(error);
        res.send(error);
    }

});

app.post("/api/handleSignUp", async (req, res, next)=>{
    console.log("/handleSignUp");
    try {
        const requestBody = {"email": req.body.username,
        "password": req.body.password, "firstName": req.body.firstName,
        "lastName": req.body.lastName, "action": "SIGN_UP"};
        // eslint-disable-next-line no-unused-vars
        await signup(req.body.username, req.body.password, req.body.firstName, req.body.lastName, next)
        await createUserTuple(requestBody);
        res.send("Sign up was a success!")
        
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
        
    }
});

app.post("/api/handleConfirmation", (req, res, next)=>{
    console.log("/handleConfirmation");
    confirmation(req.body.email, req.body.code)
    .then(resp=>res.send("Confirmation was a succes!"))
    .catch(error=>{
        console.log(error);
        res.status(400).send(error);
    })
});

app.use((err, req, res, next) => {
    console.log("🚀 -------------------------------------------------------🚀");
    console.log("🚀 -> file: server.js -> line 83 -> app.use -> err", err);
    console.log("🚀 -------------------------------------------------------🚀");
    // console.error(err.stack);
    res.status(500).send(err.message);
});


