/* eslint-disable indent */
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwkToPem = require("jwk-to-pem");
const jwk = require(process.env.AWS_JWKS_JSON_PATH);


const pem = jwkToPem(jwk.keys[0]);

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: pem,
  };


const JWT_STRATEGY = new JwtStrategy(options, function(jwtPayload, done) {
    try {
        return done(null, "success!");
    } catch (error) {
        console.log(error);
        return done(error, "failed!");
    }
});


module.exports = JWT_STRATEGY;
