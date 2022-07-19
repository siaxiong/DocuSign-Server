const User = require("./Models/User");
const PDF = require("./Models/PDF");
const Recipient = require("./Models/Recipient");

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

/**
 * It returns all the PDFs that belong to a user
 * @param userEmail - The email of the user who is logged in.
 * @returns An array of objects.
 */
const getAllPDFs = async (userEmail) =>{
    const PDFs = await PDF.findAll({
        raw: true,
        where: {
            fk_email: userEmail,
        },
    });
    console.log(PDFs);
    return PDFs;
};

/**
 * It creates a new recipient in the database
 * @returns The data is being returned.
 */
const addRecipient = async () => {
    try {
        const data = await Recipient.create({
            email: "siaxiong@yahoo.com",
            fk_fileName: "testFile",
        });

        console.log(data);

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


module.exports = {createUserTuple, getAllPDFs, addRecipient, getAllUsers};
