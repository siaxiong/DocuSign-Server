/* eslint-disable no-unused-vars */
const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const upload = require("../../../AWS/S3/s3Upload");

/* This is a post request that is being sent to the server. */
router.post("/handleAddPdf", upload.single("file"), async (req, res)=>{
    console.log("/handleAddPdf");
    let userEmail = (req.file.key).split("/");
    userEmail = userEmail[0];
    try {
        await addPDF(req.file.key, userEmail);
        res.send("success!");
    } catch (error) {
        res.send(error);
    }
});

router.delete("/deleteFile", async (req, res)=>{
    console.log("/deleteFile");
    const response = await deleteFile(req.body.token, req.body.fileName);
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
    res.send(response);
});


module.exports = router;
