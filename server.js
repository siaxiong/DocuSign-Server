const express = require("express");
const bodyparser = require("body-parser")
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 4500;


app.use(express.json());
app.listen(PORT, ()=>console.log(`Port # is : ${PORT}`))

app.get("/",(req,res)=>{


    res.send("hello 2022")
})

app.post("/handleSignIn",(req,res)=>{

    console.log("handleSignIn:");
    console.log(req.body);

    const callAPI = async () => {
        const requestBody = {"username": req.body.username,"password":req.body.password,"action":"SIGN_IN"}
        const payload = await axios.post("https://o17wemp11k.execute-api.us-west-2.amazonaws.com/beta/", requestBody).catch(error=>console.log(error))
        const data = JSON.parse(payload.data.body)
        res.send(data);
    }
    callAPI();
})

app.post("/handleSignUp", (req,res)=>{
    console.log("/handleSignUp");
    console.log(req.body);


    const callAPI = async () => {
        const requestBody = {"username": req.body.username,"password":req.body.password,"action":"SIGN_UP"}
        const payload = await axios.post("https://pnrfumyfd2.execute-api.us-west-2.amazonaws.com/beta/", requestBody)

        res.send(payload.data.body)
    }

    callAPI();
})

app.post("/handleConfirmation", (req,res)=>{
    console.log("/handleConfirmation");
    console.log(req.body);


    const callAPI = async () => {
        const requestBody = {"username": req.body.username,"code":req.body.code,"action":"CONFIRMATION"}
        const payload = await axios.post("https://4q8tdebyk5.execute-api.us-west-2.amazonaws.com/beta/", requestBody)
        res.send(payload.data.body)

    }

    callAPI();

})

