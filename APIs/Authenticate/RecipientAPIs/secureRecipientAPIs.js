/* eslint-disable no-unused-vars */
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();

router.post("/addRecipients", async (req, res)=>{
    console.log("/addRecipients");
    const emailArr = (req.body.emailList).split(",");
    const pdf = await PDF.findByPk(req.body.fileName);
    res.send("/addRecipients Success!");
});


module.exports = router;
