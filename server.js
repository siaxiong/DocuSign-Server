const express = require("express");
const bodyparser = require("body-parser")
const axios = require("axios");
const path = require("path");
const sequelize = require("./Database/db-init")
const {createUserTuple, 
addPdfTuple, addRecipient} = require("./Database/db-functions")

sequelize;

const app = express();
const PORT = 4500;


app.use(express.json());
app.listen(PORT, ()=>console.log(`Port # is : ${PORT}`))

app.get("/api",(req,res)=>{


    res.send("hello 2022")
})

app.post("/api/handleSignIn",(req,res)=>{

    console.log("handleSignIn:");
    console.log(req.body.email);
    console.log(req.body.password);

    const callAPI = async () => {
        const requestBody = {"email": req.body.email,"password":req.body.password,"action":"SIGN_IN"}
        const payload = await axios.post("https://o17wemp11k.execute-api.us-west-2.amazonaws.com/beta/", requestBody).catch(error=>console.log(error))
        // const data = JSON.parse(payload.data.body)
        res.send(payload.data.body);
    }
    callAPI();
})

app.post("/api/handleSignUp", (req,res)=>{
    console.log("/handleSignUp");
    console.log(req.body);


    const callAPI = async () => {
        const requestBody = {"email": req.body.username,"password":req.body.password,"firstName":req.body.firstName,"lastName":req.body.lastName,"action":"SIGN_UP"}
        const payload = await axios.post("https://pnrfumyfd2.execute-api.us-west-2.amazonaws.com/beta/", requestBody)
        
        createUserTuple(requestBody);
        console.log("payload from sign up")
        console.log(payload.data.body)
        res.send(payload.data.body)
    }

    callAPI();
})

app.post("/api/handleConfirmation", (req,res)=>{
    console.log("/handleConfirmation");
    console.log(req.body);


    const callAPI = async () => {
        const requestBody = {"email": req.body.email,"confirmationCode":req.body.code,"action":"CONFIRMATION"}
        const payload = await axios.post("https://4q8tdebyk5.execute-api.us-west-2.amazonaws.com/beta/", requestBody)
        res.send(payload.data.body)

    }

    callAPI();

})

app.post("/api/handleAddPdf", (req,res)=>{
    console.log("/api/handleAddPdf");
    console.log(req.body);
    const data = addPdfTuple(req.body.pdf)
    res.send(data)
})
