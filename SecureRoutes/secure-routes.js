/* eslint-disable no-unused-vars */
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const {createUserTuple,
    addPdfTuple, getAllPDFs, addRecipient,
} = require("../Database/db-functions");
const {addPDF} = require("../Database/PDF_Table/PDF-Functions");
const {deleteFile, getFile, getAllFiles, getAllEmails} = require("../AWS/S3/s3Functions");
const upload = require("../AWS/S3/upload");
const singleUpload = upload.single("file");
const {s3MiddleWare} = require("../AWS/S3/s3Client");
const path = require("path");


/* This is a post request that is being sent to the server. */
router.post("/handleAddPdf", singleUpload, async (req, res)=>{
    let userEmail = (req.file.key).split("/");
    userEmail = userEmail[0];

    try {
        await addPDF(req.file.key, userEmail);
    } catch (error) {
        console.log("🚀 ----------------------------------------------------------------------🚀");
        console.log("🚀 -> file: secure-routes.js -> line 23 -> router.post -> error", error);
        console.log("🚀 ----------------------------------------------------------------------🚀");
        res.send(error);
    }

    res.send("success!");
});

router.delete("/deleteFile", async (req, res)=>{
    console.log("/deleteFile");
    console.log(req.body);
    const response = await deleteFile(req.body.token, req.body.fileName);
    console.log(response);
    res.send(response);
});

router.get("/getFile", async (req, res)=>{
    console.log("/getFile");
    const base64 = await getFile(req.query.fileName);
    res.send(base64);
});

router.get("/getAllFiles", async (req, res)=>{
    console.log("/getAllFiles");
    const response = await getAllFiles(req.query.email);
    console.log("🚀 ---------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: secure-routes.js -> line 40 -> router.get -> response", response);
    console.log("🚀 ---------------------------------------------------------------------------🚀");

    res.send(response);
});

router.get("/getAllEmails", async (req, res)=>{
    console.log("/getAllEmails");
    console.loq(req);
    const response = await getAllEmails();
    res.send(response);
});


module.exports = router;
