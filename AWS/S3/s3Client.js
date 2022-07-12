const {S3Client} = require("@aws-sdk/client-s3");
const {CognitoIdentityClient} = require("@aws-sdk/client-cognito-identity");
const {
    fromCognitoIdentityPool,
} = require("@aws-sdk/credential-provider-cognito-identity");

const REGION = process.env.AWS_REGION;
// const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
// const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const IDENTITY_POOL_ID = process.env.AWS_IDENTITY_POOL_ID;


/* the credentials obj can also take the following properties:
Expiration, SessionToken, SecretAccessKey*/
const s3Init = (token) => {
    console.log("AccessKeyId:" + token.AccessKeyId);
    console.log("SecretKey:" + token.SecretKey);
    console.log("Expiration:" + token.Expiration);
    console.log("SessionToken:" +token.SessionToken);


    const s3Client = new S3Client({
        region: REGION,
        credentials: {
            accessKeyId: token.AccessKeyId,
            secretAccessKey: token.SecretKey,
            expiration: token.Expiration,
            sessionToken: token.SessionToken,
        },
    });

    return s3Client;
};

/**
 * The function takes in a request, response, and next function.
 * It then initializes the s3 client with
 * the token from the request body. It then sets the client to the
 *  request object and calls the next
 * function
 * @param req - The request object
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 */
const s3MiddleWare = function(req, res, next) {
    console.log("s3MiddleWare");
    console.log(req.body.token);
    const client = s3Init(req.body.token);
    req.client = client;
    next();
};

/** ========================================================================
 *                           SECTION HEADER
 *========================================================================**/

/** ==============================================
 *                   TODO
 *
 *
 *=============================================**/


/* Creating a new s3 client with the credentials from the cognito identity pool.*/
const s3Client = new S3Client({
    region: REGION,
    credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({region: REGION}),
        identityPoolId: IDENTITY_POOL_ID,
    }),
});


module.exports = {s3Init, s3Client, s3MiddleWare};
