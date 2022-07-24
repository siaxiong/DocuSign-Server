/* eslint-disable no-unused-vars */
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const Recipient = require("../../../Database/Models/Recipient");
const {addRecipients} = require("../../../Database/RECIPIENT_Table/Recipient-Functions");
const {Op} = require("sequelize");
const {raw} = require("body-parser");


// addRecipients doesnt return anything.
// Probably should return something.
router.post("/addRecipients", async (req, res)=>{
    console.log("/addRecipients");
    const emailArr = (req.body.emailList).split(",");
    await addRecipients(emailArr, req.body.fileName, req.body.ownerEmail);
    res.send("Success! /addRecipients");
});

router.get("/getRequiredForms", async (req, res)=>{
    const data = await Recipient.findAll({
        raw,
        where: {
            email: {
                [Op.eq]: "siaxiong52@gmail.com",
            },
            signed: {
                [Op.eq]: false,
            },
        }});
    console.log("🚀 -------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: secureRecipientAPIs.js -> line 39 -> router.get -> data", data);
    console.log("🚀 -------------------------------------------------------------------------🚀");

    res.send(data);
});


module.exports = router;
