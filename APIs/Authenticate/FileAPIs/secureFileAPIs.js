/* eslint-disable no-unused-vars */
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const upload = require("../../../AWS/S3/s3Upload");
const {getAllUsers} = require("../../../Database/USER_Table/USER_Functions");
const {s3DeleteFile, s3GetBase64File, s3GetAllFiles} = require("../../../AWS/S3/s3Functions");
const {addPDF, getAssignedPDFs, getPendingPDFs, getCompletedPDFs} =
require("../../../Database/PDF_Table/PDF-Functions");
const {markAsSigned} = require("../../../Database/RECIPIENT_Table/Recipient-Functions");
const {findAllPDF} = require("../../../Database/PDF_Table/PDF-Functions");

/* This is a post request that is being sent to the server. */
router.post("/handleAddPdf", upload.single("file"), async (req, res, next)=>{
    console.log("/handleAddPdf");
    let extractEmail = (req.file.key).split("/");
    extractEmail = extractEmail[0];
    await addPDF(extractEmail, req.file, next);
    res.send("success!");
});

router.get("/getAllUsers", async (req, res, next)=>{
    console.log("/getAllUsers");
    const data = await getAllUsers(next);
    res.send(data);
});

router.delete("/deleteFile", async (req, res, next)=>{
    console.log("/deleteFile");
    const response = await s3DeleteFile(req.body.token, req.body.fileName);
    res.send(response);
});

router.get("/getBase64File", async (req, res, next)=>{
    console.log("/getBase64File");
    console.log(req.query.formName);
    console.log(req.query.formVersion);
    const base64 = await s3GetBase64File(req.query.formName, req.query.formVersion);
    res.send(base64);
});

router.get("/getAvailableFiles", async (req, res, next)=>{
    console.log("/getAvailableFiles");
    let pdfs = await findAllPDF(req.query.email, null, next);
    pdfs = (pdfs.length != 0) ? pdfs : [];
    res.send(pdfs);
});

router.get("/getAssignedPDFs", async (req, res, next)=>{
    console.log("/getAssignedPDFs");
    const data = await getAssignedPDFs(req.query.email, next);
    console.log("🚀 --------------------------------------------------------------------🚀");
    console.log("🚀 -> file: secureFileAPIs.js -> line 46 -> router.get -> data", data);
    console.log("🚀 --------------------------------------------------------------------🚀");
    res.send(data);
});

router.get("/getPendingPDFs", async (req, res, next)=>{
    console.log(req.query.email);
    const data = await getPendingPDFs(req.query.email, next);
    res.send(data);
});

router.get("/getCompletedPDFs", async (req, res, next) => {
    console.log("/getCompletedPDFs");
    const response = await getCompletedPDFs(req.query.email, next);
    console.log("🚀 ----------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: secureFileAPIs.js -> line 58 -> router.get -> response", response);
    console.log("🚀 ----------------------------------------------------------------------------🚀");
    res.send(response);
});

module.exports = router;
