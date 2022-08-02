const {
    GetObjectCommand,
    CopyObjectCommand,
    DeleteObjectCommand,
    ListObjectsCommand,
} = require("@aws-sdk/client-s3");
const {s3Init, s3Client} = require("./s3Client");
const {v4: uuidv4} = require("uuid");


const s3CopyPDF = async (client, email, key, version ) => {
    const options = {
        Bucket: "sxbucket22",
        // Key: email+ "/" + path.basename(key, ".pdf") + "-" + email + "+" + uuidv4() + ".pdf",
        Key: key,
        CopySource: "sxbucket22/" + key + "?versionId=" + version,
    };
    const cmd = new CopyObjectCommand(options);
    const response = await client.send(cmd);
    return response;
};


/**
 * It takes a token and a file name, initializes an S3 client, and
 * then deletes the file
 *
 * @param token - The token that was returned from the login function.
 * @param fileName - The name of the file you want to delete.
 * @returns The response from the delete command.
 */
const s3DeleteFile = async (token, fileName) => {
    const s3Client = s3Init(token);
    const bucketParams = {
        Bucket: "sxbucket22",
        Key: fileName,
    };
    const cmd = new DeleteObjectCommand(bucketParams);
    const response = await s3Client.send(cmd);
    return response;
};


/**
 * It takes a stream and returns a promise that resolves to a
 * base64 encoded string
 * @param stream - The stream to convert to a string.
 */
const streamToString = (stream) =>
    new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        // eslint-disable-next-line max-len
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
    });


/**
 * It takes a file name as an argument, and returns the file from the bucket.
 * @param formName - The name of the file you want to get from the bucket.
 * @param formVersion
 */
const s3GetBase64File = async (formName, formVersion) => {
    console.log("🚀 ------------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: s3Functions.js -> line 67 -> s3GetBase64File -> formName", formName);
    console.log("🚀 ------------------------------------------------------------------------------🚀");
    console.log("🚀 ------------------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: s3Functions.js -> line 67 -> s3GetBase64File -> formVersion", formVersion);
    console.log("🚀 ------------------------------------------------------------------------------------🚀");
    const bucketParams = {
        Bucket: "sxbucket22",
        Key: formName,
        VersionId: formVersion,
    };
    const cmd = new GetObjectCommand(bucketParams);
    const response = await s3Client.send(cmd);
    const base64 = await streamToString(response.Body);
    return base64;
};

/**
 * It returns a list of all the files in the bucket
 * @param email
 */
const s3GetAllFiles = async (email) => {
    const bucketParams = {
        Bucket: "sxbucket22",
        Prefix: email,
    };
    const cmd = new ListObjectsCommand(bucketParams);
    try {
        const response = await s3Client.send(cmd);
        if (!response.Contents) {
            console.log(response.Contents);
            return null;
        };
        const keyArr = response.Contents.map(item => item.Key);
        const base64FileArr = await Promise.all(keyArr.map(async key =>{
            const data = await s3GetFile(key);
            return {fileName: key, data};
        }));
        return base64FileArr;
    } catch (error) {
        console.log(error);
        return error;
    }
};


module.exports = {s3CopyPDF, s3DeleteFile, s3GetBase64File, s3GetAllFiles};
