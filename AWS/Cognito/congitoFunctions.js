const {InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand} = require("@aws-sdk/client-cognito-identity-provider");
const {GetCredentialsForIdentityCommand, GetIdCommand} = require("@aws-sdk/client-cognito-identity");
const {userPoolClient, identityPoolClient} = require("./cognitoClients");

require("dotenv").config({path: "/Users/siaxiong/Desktop/DocuSign/DocuSign-Backend/.env"});

const ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const IDENTITY_POOL_ID = process.env.AWS_IDENTITY_POOL_ID;
const USER_POOL_APP_CLIENT_ID = process.env.AWS_USER_POOL_APP_CLIENT_ID;
const USER_POOL_ARN = process.env.AWS_USER_POOL_ARN;

const login = async (email, password) => {
    const authCMD = new InitiateAuthCommand({
        ClientId: USER_POOL_APP_CLIENT_ID,
        AuthParameters: {
            "USERNAME": email,
            "PASSWORD": password,
        },
        AuthFlow: "USER_PASSWORD_AUTH",
    });

    const authResult = await userPoolClient.send(authCMD);

    const getIdCMD = new GetIdCommand({
        IdentityPoolId: IDENTITY_POOL_ID,
        AccountId: ACCOUNT_ID,
        Logins: {
            [USER_POOL_ARN]: authResult.AuthenticationResult.IdToken,
        },
    });

    const response = await identityPoolClient.send(getIdCMD);

    const credentials = await identityPoolClient.send(new GetCredentialsForIdentityCommand({
        IdentityId: response.IdentityId,
        Logins: {
            [USER_POOL_ARN]: authResult.AuthenticationResult.IdToken,
        },
    }));

    credentials.email = email;
    credentials.jwt = authResult.AuthenticationResult.IdToken;
    return credentials;
};

const signup = async (email, password, firstName, lastName) => {
    const userAttr = [{
        "Name": "given_name",
        "Value": firstName,
    }, {
        "Name": "family_name",
        "Value": lastName,
    },
    {
        "Name": "email",
        "Value": email,
    }];

    const signUpCMD = new SignUpCommand({
        "ClientId": USER_POOL_APP_CLIENT_ID,
        "Username": email,
        "Password": password,
        "UserAttributes": userAttr,
    });

    const response = await userPoolClient.send(signUpCMD);
    return response;
};

const confirmation = async (email, code) => {
    const confirmCMD = new ConfirmSignUpCommand({
        "ClientId": USER_POOL_APP_CLIENT_ID,
        "Username": email,
        "ConfirmationCode": code,
    });
    const response = await userPoolClient.send(confirmCMD);
    return response;
};

module.exports = {login, signup, confirmation};


