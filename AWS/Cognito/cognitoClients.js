const {CognitoIdentityProviderClient} = require("@aws-sdk/client-cognito-identity-provider");
const {CognitoIdentityClient} = require("@aws-sdk/client-cognito-identity");

require("dotenv").config({path: "/Users/siaxiong/Desktop/DocuSign/DocuSign-Backend/.env"});

const REGION = process.env.AWS_REGION;

const userPoolClient = new CognitoIdentityProviderClient({
    region: REGION,
});

const identityPoolClient = new CognitoIdentityClient({
    region: REGION,
});

module.exports = {userPoolClient, identityPoolClient};


