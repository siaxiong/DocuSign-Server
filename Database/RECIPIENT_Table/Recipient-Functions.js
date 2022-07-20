const Recipient = require("../Models/Recipient");


const addRecipients = async (emailList, fileName) => {
    emailList.forEach(email => {
        Recipient.create({
            email: email,
            signed: false,
            fk_fileName: fileName,
        });
    });
};

module.exports = {addRecipients};
