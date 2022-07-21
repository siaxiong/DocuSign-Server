const PDF = require("../Models/PDF");
const {Op} = require("sequelize");
const {getAssignedRecipients} = require("../RECIPIENT_Table/Recipient-Functions");

const addPDF = async (fileName, email) => {
    PDF.create({
        fileName,
        fk_email: email,
    });
};

const findAllPDF = async (email) => {
    const pdfs = await PDF.findAll({
        raw: true,
        where: {
            fk_email: {
                [Op.eq]: email,
            },
        },
    });
    return pdfs;
};

const findPDF = async (fileName, email) => {
    const boolean = PDF.findOne({
        where: {
            fileName,
            USEREmail: email,
        },
    });

    return boolean;
};

const getAssignedPDFs = async (email) => {
    const pdfs = await findAllPDF(email);
    let assignedPDFs = pdfs.filter(pdf => {
        const originalOwner = ((pdf.fileName).split("/"))[0];
        return originalOwner != email ? true : false;
    });
    assignedPDFs = await Promise.all(assignedPDFs.map(async pdf => {
        const recipients = await getAssignedRecipients(pdf.fileName);
        return recipients;
    }));
    return assignedPDFs;
};

const getPendingPDFs = async (email) => {
    const pdfs = await findAllPDF(email);
    const myPDFs = pdfs.filter(pdf => {
        const originalOwner = ((pdf.fileName).split("/"))[0];
        return originalOwner == email ? true : false;
    });

    

};


module.exports = {addPDF, findPDF, findAllPDF, getAssignedPDFs};
