const Recipient = require("../Models/Recipient");
const PDF = require("../Models/PDF");
const {Op} = require("sequelize");

const addRecipients = async (emailList, fileName) => {
    console.log("🚀 -------------------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: Recipient-Functions.js -> line 5 -> addRecipients -> emailList", emailList);
    console.log("🚀 -------------------------------------------------------------------------------------🚀");
    emailList.forEach((email, index) => {
        Recipient.create({
            email: email,
            order: index + 1,
            signed: false,
            fk_fileName: fileName,
        });
        PDF.create({
            fileName,
            fk_email: email,
        });
    });
};

const getAssignedRecipients = async (fileName) => {
    const recipients = await Recipient.findAll({
        raw: true,
        where: {
            fk_fileName: {
                [Op.eq]: fileName,
            },
        },
    });

    return recipients;
};

module.exports = {addRecipients, getAssignedRecipients};
