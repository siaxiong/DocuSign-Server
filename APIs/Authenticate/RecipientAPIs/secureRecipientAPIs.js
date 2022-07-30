/* eslint-disable no-unused-vars */
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const Recipient = require("../../../Database/Models/Recipient");
const {updatePDFVersion} = require("../../../Database/PDF_Table/PDF-Functions");
const {addRecipients, markAsSigned, isInOrder} = require("../../../Database/RECIPIENT_Table/Recipient-Functions");
const {Op} = require("sequelize");
const {raw} = require("body-parser");
const upload = require("../../../AWS/S3/s3Upload");
const {s3InitMiddleware} = require("../../Middleware/middlewareFunctions");
// addRecipients doesnt return anything.
// Probably should return something.

router.post("/addRecipientsInOrder", upload.single("file"), async (req, res, next)=>{
    console.log("/addRecipientsInOrder");
    const emailArr = (req.query.emailList).split(",");
    console.log("addRecipientsInOrder req.file");
    await updatePDFVersion(req.query.ownerEmail, req.file.versionId, req.query.formVersion, req.query.formName);
    await addRecipients(emailArr, req.query.ownerEmail, null, req.query.formName, req.file.versionId, req.query.formVersion, true, next);
    res.send("Success! /addRecipientsInOrder");
});

router.post("/addRecipientsUnOrder", upload.single("file"), s3InitMiddleware, async (req, res, next)=>{
    console.log("/addRecipientsUnOrder");
    const emailArr = (req.query.emailList).split(",");
    console.log("addRecipientsUnOrder req.file");
    console.log(req.file);
    await updatePDFVersion(req.query.ownerEmail, req.file.versionId, req.query.formVersion, req.query.formName);
    await addRecipients(emailArr, req.query.ownerEmail, req.s3Client, req.query.formName, req.file.versionId, req.query.formVersion, false, next);
    res.send("Success! /addRecipientsUnOrder");
});
router.post("/updateRecipient", upload.single("file"), async (req, res, next)=>{
    console.log("/updateRecipient");

    const value = await isInOrder(req.query.formVersion, next);
    console.log("🚀 ----------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: secureRecipientAPIs.js -> line 37 -> router.post -> value", value);
    console.log("🚀 ----------------------------------------------------------------------------🚀");
    // await updatePDFVersion(req.query.email, req.file.versionId, req.query.formVersion, req.query.formName, next);
    // const response = await markAsSigned(req.file.versionId, req.query.email, req.query.formVersion, req.query.formName, next);
    res.send("success");
});


module.exports = router;
