const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const jwk = require("./jwks.json");

const verifyJwt = async (token) => {
    const arr = token.split(".");
    const buff = Buffer.from(arr[0], "base64");
    const text = buff.toString("utf8");

    const kid = JSON.parse(text).kid;

    const publicJWK = jwk.keys.find((item) => item.kid === kid);

    const pem = jwkToPem(publicJWK);


    const decodedToken = jwt.verify(token, pem);
    return decodedToken;
};


module.exports = {verifyJwt};
