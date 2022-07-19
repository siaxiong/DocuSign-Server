const express = require("express");
const axios = require("axios");
const cors = require("cors");
const {verifyJwt} = require("./Strategy/verify_jwt");
const passport = require("passport");
const secureRoutes = require("./SecureRoutes/secure-routes");
const JWT_STRATEGY = require("./Strategy/JWT_STRATEGY");
const {createUserTuple} = require("./Database/db-functions");
// const sequelize = require("./Database/connection");
const PDF = require("./Database/Models/PDF");
const USER = require("./Database/Models/Recipient");
const RECIPIENT = require("./Database/Models/Recipient");
const ASSOCIATIONS = require("./Database/Models/Associations");

// sequelize.drop();

const app = express();
const PORT = 4500;


app.listen(PORT, ()=>console.log(`Port # is : ${PORT}`));
app.use(express.json());
app.use(cors());
passport.use(JWT_STRATEGY);
app.use("/api/db",
    passport.authenticate("jwt", {session: false}), secureRoutes);


app.post("/api/handleSignIn", (req, res)=>{
    console.log("/api/handleSignIn");
    const callAPI = async () => {
        try {
            const requestBody = {"email": req.body.email,
                "password": req.body.password, "action": "SIGN_IN"};
            const payload = await axios
                .post("https://o17wemp11k.execute-api.us-west-2.amazonaws.com/beta/", requestBody)
                .catch((error)=>console.log(error));
            const content = JSON.parse(payload.data.body);
            verifyJwt(content.jwt) ? res.send(content) : res.send(null);
        } catch (error) {
            console.error(error);
            res.send(error);
        }
    };
    callAPI();
});

app.post("/api/handleSignUp", (req, res)=>{
    console.log("/handleSignUp");
    // console.log(req.body);
    const callAPI = async () => {
        const requestBody = {"email": req.body.username,
            "password": req.body.password, "firstName": req.body.firstName,
            "lastName": req.body.lastName, "action": "SIGN_UP"};
        const payload = await axios
            .post("https://pnrfumyfd2.execute-api.us-west-2.amazonaws.com/beta/", requestBody);
        createUserTuple(requestBody);
        res.send("success");
    };

    callAPI();

    // res.send("success");
});

app.post("/api/handleConfirmation", (req, res)=>{
    console.log("/handleConfirmation");

    const callAPI = async () => {
        const requestBody = {"email": req.body.email,
            "confirmationCode": req.body.code, "action": "CONFIRMATION"};
        const payload = await axios.post("https://4q8tdebyk5.execute-api.us-west-2.amazonaws.com/beta/", requestBody);
        res.send(payload.data.body.Credentials);
    };

    callAPI();
});
