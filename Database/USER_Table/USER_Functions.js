const USER = require("../Models/User");

const getAllUsers = async (next) => {
    return USER.findAll({
        raw: true,
    }).then(resp=>resp).catch(err=>next(err));
};

module.exports = {getAllUsers};
