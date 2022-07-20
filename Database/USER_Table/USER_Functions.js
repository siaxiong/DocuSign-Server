const USER = require("../Models/User");

const getAllUsers = async () => {
    const users = USER.findAll({
        attributes: ["email"],
        raw: true,
    });

    return users;
};

module.exports = {getAllUsers};
