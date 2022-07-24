const Recipient = require("../Models/Recipient");
const PDF = require("../Models/PDF");
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line max-len
const {Op} = require("sequelize");

const addRecipients = async (emailList, fileName, ownerEmail) => {
    emailList.forEach((email, index) => {
        Recipient.create({
            email: email,
            order: index + 1,
            reject: false,
            signed: false,
            fk_fileName: fileName,
        });
        PDF.create({
            fileName,
            fk_email: email,
            completed: false,
        });
    });

    PDF.update({completed: false}, {where: {fileName: {[Op.eq]: fileName}, fk_email: {[Op.eq]: ownerEmail}}});
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
    console.log("🚀 ------------------------------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: Recipient-Functions.js -> line 34 -> getAssignedRecipients -> recipients", recipients);
    console.log("🚀 ------------------------------------------------------------------------------------------------🚀");
    return recipients;
};

const findAllRecipient = async (fileName) => {
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
const isMyTurnToSign = async (fileName, myEmail) => {
    const recipients = await findAllRecipient(fileName);
    console.log("🚀 -----------------------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: Recipient-Functions.js -> line 53 -> isMyTurnToSign -> recipients", recipients);
    console.log("🚀 -----------------------------------------------------------------------------------------🚀");

    recipients.sort((a, b)=>{
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
    });
    console.log("🚀 ------------------------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: Recipient-Functions.js -> line 64 -> recipients.sort -> recipients", recipients);
    console.log("🚀 ------------------------------------------------------------------------------------------🚀");

    if ((myEmail == recipients[0].email) && !recipients.signed) return true;

    return recipients.some((recipient, index) => {
        if (index == 0) return false;
        if ((myEmail == recipient.email)) {
            return recipients[index-1].signed ? true : false;
        } else {
            return false;
        }
    });
};

const getMySinglePDF = async (fileName, myEmail) => {
    const data = await Recipient.findOne({
        raw: true,
        where: {
            fk_fileName: {
                [Op.eq]: fileName,
            },
            signed: {
                [Op.eq]: false,
            },
            email: {
                [Op.eq]: myEmail,
            },
        },
    });
    console.log("🚀 --------------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: Recipient-Functions.js -> line 55 -> getMyAssignedPDFs -> data", data);
    console.log("🚀 --------------------------------------------------------------------------------🚀");
    return data;
};

const markAsSigned = async (email, fileName) => {
    const response = await Recipient.update({
        signed: true},
    {where: {
        email: {
            [Op.eq]: email,
        },
        fk_fileName: {
            [Op.eq]: fileName,
        },
    },
    });

    await PDF.update({
        completed: true,
    }, {
        where: {
            fk_email: {
                [Op.eq]: email,
            },
            fileName: {
                [Op.eq]: fileName,
            },
        },
    });

    // const resp = await Recipient.findAll({
    //     raw: true,
    //     where: {
    //         signed: {
    //             [Op.eq]: false,
    //         },
    //         email: {
    //             [Op.eq]: email,
    //         },
    //         fk_fileName: {
    //             [Op.eq]: fileName,
    //         },
    //     },
    // });
    const resp = await Recipient.findAll({
        raw: true,
        where: {
            fk_fileName: {
                [Op.eq]: fileName,
            },
            email: {
                [Op.eq]: email,
            },
            signed: {
                [Op.eq]: false,
            },
        },
    });

    console.log("🚀 ----------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: Recipient-Functions.js -> line 118 -> markAsSigned -> resp", resp);
    console.log("🚀 ----------------------------------------------------------------------------🚀");

    // eslint-disable-next-line brace-style
    (resp.length == 0) ? PDF.update({completed: true},
        // eslint-disable-next-line max-len
        {where: {fileName: {[Op.eq]: fileName}, fk_email: {[Op.eq]: fileName.substring(0, fileName.indexOf("/"))}}}) : null;
    // (resp.length) == 0 ? async function() {
    //     testFunction();
    // }() : null;

    return response;
};


module.exports = {addRecipients, isMyTurnToSign, getAssignedRecipients, markAsSigned, getMySinglePDF};
