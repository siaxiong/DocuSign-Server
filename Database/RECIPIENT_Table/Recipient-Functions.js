const Recipient = require("../Models/Recipient");
const PDF = require("../Models/PDF");
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line max-len
const {Op} = require("sequelize");

const addRecipients = async (emailList, fileName, ownerEmail, next) => {
    emailList.forEach((email, index) => {
        Recipient.create({
            email: email,
            order: index + 1,
            reject: false,
            signed: false,
            fk_fileName: fileName,
        }).catch(err=>next(err));
        PDF.create({
            fileName,
            fk_email: email,
            completed: false,
        }).catch(err=>next(err));
    });

    // eslint-disable-next-line max-len
    PDF.update({completed: false}, {where: {fileName: {[Op.eq]: fileName}, fk_email: {[Op.eq]: ownerEmail}}}).catch(err=>next(err));
};

const getAssignedRecipients = async (fileName, next) => {
    return await Recipient.findAll({
        raw: true,
        where: {
            fk_fileName: {
                [Op.eq]: fileName,
            },
        },
    }).then(response=>response).catch(err=>next(err));
};

const findAllRecipient = async (fileName, next) => {
    return await Recipient.findAll({
        raw: true,
        where: {
            fk_fileName: {
                [Op.eq]: fileName,
            },
        },
    }).then(response=>response).catch(err=>next(err));
};
const isMyTurnToSign = async (fileName, myEmail) => {
    const recipients = await findAllRecipient(fileName);
    recipients.sort((a, b)=>{
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
    });
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

const getMySinglePDF = async (fileName, myEmail, next) => {
    return await Recipient.findOne({
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
    }).then(response=>response).catch(err=>next(err));
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
    }).catch(err=>next(err));

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
    }).catch(err=>next(err));

    const resp = await Recipient.findAll({
        raw: true,
        where: {
            fk_fileName: {
                [Op.eq]: fileName,
            },
            signed: {
                [Op.eq]: false,
            },
        },
    }).catch(err=>next(err));

    (resp.length == 0) ? PDF.update({completed: true},
        {where: {fileName: {[Op.eq]: fileName}, fk_email: {
            [Op.eq]: fileName.substring(0, fileName.indexOf("/"))}}}).catch(err=>next(err)): null;

    return response;
};


module.exports = {addRecipients, isMyTurnToSign, getAssignedRecipients, markAsSigned, getMySinglePDF};
