/* eslint-disable no-unused-vars */
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const {createUserTuple,
    addPdfTuple, getAllPDFs, addRecipient,
} = require("../Database/db-functions");
const {deleteFile, getFile, getAllFiles} = require("../AWS/S3/s3Functions");
const upload = require("../AWS/S3/upload");
const singleUpload = upload.single("file");
const {s3MiddleWare} = require("../AWS/S3/s3Client");


/* This is a post request that is being sent to the server. */
router.post("/handleAddPdf", singleUpload, async (req, res)=>{
    console.log("🚀 ------------------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: secure-routes.js -> line 24 -> router.post -> handleAddPdf ->" + req.body);
    console.log("🚀 ------------------------------------------------------------------------------------🚀");

    // console.log(req.client)
    // console.log(req.file)

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
    const base64 = await getFile(req.query.fileName);
    res.send(base64);
});

router.get("/getAllFiles", async (req, res)=>{
    console.log("/getAllFiles");
    res.send("Success");
});


module.exports = router;
