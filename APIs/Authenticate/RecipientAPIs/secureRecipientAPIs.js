/* eslint-disable no-unused-vars */
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const Recipient = require("../../../Database/Models/Recipient");
const {updatePDFVersion} = require("../../../Database/PDF_Table/PDF-Functions");
const {addRecipients, markAsSignedInOrder, isInOrder, markAsSignedUnOrder} = require("../../../Database/RECIPIENT_Table/Recipient-Functions");
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
    await updatePDFVersion(req.query.ownerEmail, req.file.versionId, req.query.formVersion, req.query.formName);
    await addRecipients(emailArr, req.query.ownerEmail, req.s3Client, req.query.formName, req.file.versionId, req.query.formVersion, false, next);
    res.send("Success! /addRecipientsUnOrder");
});
router.post("/updateRecipient", upload.single("file"), async (req, res, next)=>{
    console.log("/updateRecipient");
    const email = req.query.email;
    const newVersionId = req.file.versionId;
    const currentVersion = req.query.formVersion;
    const fileName = req.query.formName;

    const value = await isInOrder(currentVersion, next);
    if (value) await markAsSignedInOrder(newVersionId, email, currentVersion, fileName, next);
    else await markAsSignedUnOrder(newVersionId, email, currentVersion, fileName, next);
    res.send("success");
});


module.exports = router;
