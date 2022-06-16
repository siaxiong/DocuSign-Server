const express = requrie("express");
const axios = requrie("axios");

const app = express();
const PORT = 5000;

app.listen(PORT, ()=>console.log(`Port # is : ${PORT}`))

app.get("/",(req,res)=>{


    res.send("hello 2022")
})

