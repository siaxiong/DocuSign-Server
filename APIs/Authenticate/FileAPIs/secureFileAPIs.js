/* eslint-disable no-unused-vars */
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const upload = require("../../../AWS/S3/s3Upload");
const {s3DeleteFile, s3GetSingleFile, s3GetAllFiles} = require("../../../AWS/S3/s3Functions");
const {addPDF, getAssignedPDFs, getPendingPDFs, getCompletedPDFs} =
require("../../../Database/PDF_Table/PDF-Functions");
const {markAsSigned} = require("../../../Database/RECIPIENT_Table/Recipient-Functions");
const {findAllPDF} = require("../../../Database/PDF_Table/PDF-Functions");

/* This is a post request that is being sent to the server. */
router.post("/handleAddPdf", upload.single("file"), async (req, res, next)=>{
    console.log("/handleAddPdf");
    let extractEmail = (req.file.key).split("/");
    extractEmail = extractEmail[0];
    await addPDF(req.file.key, extractEmail, next);
});

router.post("/updateUserSignedPDF", upload.single("file"), async (req, res, next)=>{
    console.log("/updateUserSignedPDF");
    const response = await markAsSigned(req.query.email, req.query.fileName);
    res.send("success");
});

router.delete("/deleteFile", async (req, res, next)=>{
    console.log("/deleteFile");
    const response = await s3DeleteFile(req.body.token, req.body.fileName);
    res.send(response);
});

router.get("/getFile", async (req, res, next)=>{
    console.log("/getFile");
    const base64 = await s3GetSingleFile(req.query.fileName);
    res.send(base64);
});

router.get("/getAllFiles", async (req, res, next)=>{
    console.log("/getAllFiles");
    let pdfs = await findAllPDF(req.query.email, null);
    pdfs = (pdfs.length != 0) ? pdfs : [];
    res.send(pdfs);
});

router.get("/getAssignedPDFs", async (req, res, next)=>{
    console.log("/getAssignedPDFs");
    const data = await getAssignedPDFs(req.query.email);
    res.send(data);
});

router.get("/getPendingPDFs", async (req, res, next)=>{
    console.log(req.query.email);
    const data = await getPendingPDFs(req.query.email);
    res.send(data);
});

router.get("/getCompletedPDFs", async (req, res, next) => {
    console.log("/getCompletedPDFs");
    const response = await getCompletedPDFs(req.query.email);
    res.send(response);
});

module.exports = router;
