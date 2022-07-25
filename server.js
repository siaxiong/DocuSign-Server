const express = require("express");
const axios = require("axios");
const cors = require("cors");
const {verifyJwt} = require("./APIs/Strategy/verify_jwt");
const passport = require("passport");
const JWT_STRATEGY = require("./APIs/Strategy/JWT_STRATEGY");
const {createUserTuple} = require("./APIs/Unauthenticate/UserAPIs/userAPIs");
const fileAPIroutes = require("./APIs/Authenticate/FileAPIs/secureFileAPIs");
const userAPIroutes = require("./APIs/Authenticate/UserAPIs/secureUserAPIs");
const recipientAPIroutes = require("./APIs/Authenticate/RecipientAPIs/secureRecipientAPIs");
const {login, signup, confirmation} = require("./AWS/Cognito/congitoFunctions");
const sequelize = require("./Database/connection");
const PDF = require("./Database/Models/PDF");
const USER = require("./Database/Models/Recipient");
const RECIPIENT = require("./Database/Models/Recipient");
const ASSOCIATIONS = require("./Database/Models/Associations");

// createUserTuple({firstName: "sia2", lastName: "xiong", email: "siaxiong2@csus.edu"});
// createUserTuple({firstName: "sia52", lastName: "xiong", email: "siaxiong52@gmail.com"});
// createUserTuple({firstName: "sia23", lastName: "xiong", email: "siaxiong23@icloud.com"});
// createUserTuple({firstName: "siadev", lastName: "xiong", email: "siaxiongdev@gmail.com"});

// sequelize.drop();


const app = express();
const PORT = 4500;
require("dotenv").config();

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


app.post("/api/handleSignIn", (req, res)=>{
    console.log("/api/handleSignIn");
    const callAPI = async () => {
        try {
            const payload = await login(req.body.email, req.body.password);
            verifyJwt(payload.jwt) ? res.send(payload) : res.send(null);
        } catch (error) {
            console.error(error);
            res.send(error);
        }
    };
    callAPI();
});

app.post("/api/handleSignUp", (req, res)=>{
    console.log("/handleSignUp");
    const callAPI = async () => {
        const requestBody = {"email": req.body.username,
            "password": req.body.password, "firstName": req.body.firstName,
            "lastName": req.body.lastName, "action": "SIGN_UP"};
        // eslint-disable-next-line no-unused-vars
        const payload = await signup(req.body.username, req.body.password, req.body.firstName, req.body.lastName);
        createUserTuple(requestBody);
        res.send("success");
    };
    callAPI();
});

app.post("/api/handleConfirmation", (req, res)=>{
    console.log("/handleConfirmation");
    const callAPI = async () => {
        const payload = await confirmation(req.body.email, req.body.code);
        res.send(payload);
    };
    callAPI();
});
