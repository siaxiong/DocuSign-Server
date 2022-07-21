/* eslint-disable no-unused-vars */
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const upload = require("../../../AWS/S3/s3Upload");
const {s3DeleteFile, s3GetFile, s3GetAllFiles} = require("../../../AWS/S3/s3Functions");
const {addPDF, getAssignedPDFs} = require("../../../Database/PDF_Table/PDF-Functions");

/* This is a post request that is being sent to the server. */
router.post("/handleAddPdf", upload.single("file"), async (req, res)=>{
    console.log("/handleAddPdf");
    let extractEmail = (req.file.key).split("/");
    extractEmail = extractEmail[0];
    try {
        await addPDF(req.file.key, extractEmail);
        res.send("success!");
    } catch (error) {
        res.send(error);
    }
});

router.delete("/deleteFile", async (req, res)=>{
    console.log("/deleteFile");
    const response = await s3DeleteFile(req.body.token, req.body.fileName);
    res.send(response);
});

router.get("/getFile", async (req, res)=>{
    console.log("/getFile");
    const base64 = await s3GetFile(req.query.fileName);
    res.send(base64);
});

router.get("/getAllFiles", async (req, res)=>{
    console.log("/getAllFiles");
    const response = await s3GetAllFiles(req.query.email);
    res.send(response);
});

router.get("/getAssignedPDFs", async (req, res)=>{
    console.log("/getAssignedPDFs");
    const data = await getAssignedPDFs(req.query.email);
    console.log("🚀 --------------------------------------------------------------------🚀");
    console.log("🚀 -> file: secureFileAPIs.js -> line 43 -> router.get -> data", data);
    console.log("🚀 --------------------------------------------------------------------🚀");
    res.send(data);
});


module.exports = router;
