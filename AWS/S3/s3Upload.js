const {s3Client} = require("./s3Client");
const multer = require("multer");
const multerS3 = require("multer-s3");


const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const fileFilter = (req, file, cb) => {
    if ((file.originalname).endsWith(".pdf")) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type, only PDF allowed!"), false);
    }
};


/* The above code is using multer to upload files to an S3 bucket. */
const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: BUCKET_NAME,
        metadata: function(req, file, cb) {
            cb(null, Object.assign({}, req.body));
        },
        key: function(req, file, cb) {
            cb(null, file.originalname);
        },
    }),
    preservePath: true,
    fileFilter,
});


module.exports=upload;
