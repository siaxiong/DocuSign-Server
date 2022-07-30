const {s3Init} = require("../../AWS/S3/s3Client");


const s3InitMiddleware = (req, res, next) => {
    const s3Client = s3Init(JSON.parse(req.query.token));
    req.s3Client = s3Client;
    next();
};

module.exports = {s3InitMiddleware};
