/* eslint-disable no-unused-vars */
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const {getAllEmails} = require("../../../AWS/S3/s3Functions");


router.get("/getAllEmails", async (req, res)=>{
    console.log("/getAllEmails");
    const response = await getAllEmails();
    res.send(response);
});

module.exports = router;
