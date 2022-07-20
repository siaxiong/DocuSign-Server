const User = require("../../../Database/Models/User");

/**
 * It creates a new user tuple in the database
 * @param user - The user object that is passed in from the front end.
 * @returns The data is being returned.
 */
const createUserTuple = async (user) => {
    console.log("createUserTuple");
    console.log(user);

    try {
        const data = await User.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });

        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
};


const getAllUsers = async () => {
    try {
        const data = await User.findAll({attributes: ["email"]});
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
};

module.exports = {createUserTuple, getAllUsers};


