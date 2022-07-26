const PDF = require("../Models/PDF");
const {Op} = require("sequelize");
const {getAssignedRecipients, getMySinglePDF, isMyTurnToSign} = require("../RECIPIENT_Table/Recipient-Functions");
const {response} = require("express");

const addPDF = async (fileName, email, next) => {
    return await PDF.create({
        fileName,
        fk_email: email,
    }).then(response=>response).catch(err=>next(err));
};

const findAllPDF = async (email, status, next) => {
    return await PDF.findAll({
        raw: true,
        where: {
            fk_email: {
                [Op.eq]: email,
            },
            completed: {
                [Op.eq]: status,
            },
        },
    }).then(response=>response).catch(err=>next(err));
};

const getAssignedPDFs = async (email, next) => {
    const pdfs = await findAllPDF(email, false).catch(err=>next(err));

    let assignedPDFs = pdfs.filter(pdf => {
        const originalOwner = ((pdf.fileName).split("/"))[0];
        return originalOwner != email ? true : false;
    });

    assignedPDFs = await Promise.all(assignedPDFs.map(async pdf => {
        const myPDF = await getMySinglePDF(pdf.fileName, email);
        let isMyTurn = false;
        if (myPDF) {
            isMyTurn = await isMyTurnToSign(myPDF.fk_fileName, email);
        }
        return isMyTurn ? myPDF : null;
    }));
    assignedPDFs = assignedPDFs.filter(pdf => pdf != null);
    return assignedPDFs;
};

const getPendingPDFs = async (email, next) => {
    const pdfs = await findAllPDF(email, false);
    let assignedPDFs = pdfs.filter(pdf => {
        const originalOwner = ((pdf.fileName).split("/"))[0];
        return ((originalOwner == email)) ? true : false;
    });

    assignedPDFs = await Promise.all(assignedPDFs.map(async pdf => {
        return await getAssignedRecipients(pdf.fileName);
    }));

    return assignedPDFs.filter(pdf => pdf.length != 0);
};

const getCompletedPDFs = async (email, next) => {
    return await PDF.findAll({
        raw: true,
        where: {
            completed: {
                [Op.eq]: true,
            },
            fk_email: {
                [Op.eq]: email,
            },
        },
    }).then(response=>response).catch(err=>next(err));
};

const markPDFAsCompleted = async (fileName, email, next) => {
    return await PDF.update({
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
    }).then(response=response).catch(err=>next(err));
};

module.exports = {addPDF, findAllPDF,
    getAssignedPDFs, getPendingPDFs, markPDFAsCompleted, getCompletedPDFs};
