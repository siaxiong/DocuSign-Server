const PDF = require("../Models/PDF");
const {Op} = require("sequelize");
const {getAssignedRecipients, getMySinglePDF, isMyTurnToSign} = require("../RECIPIENT_Table/Recipient-Functions");

const addPDF = async (fileName, email) => {
    PDF.create({
        fileName,
        fk_email: email,
    });
};

const findAllPDF = async (email, status) => {
    const pdfs = await PDF.findAll({
        raw: true,
        where: {
            fk_email: {
                [Op.eq]: email,
            },
            completed: {
                [Op.eq]: status,
            },
        },
    });
    console.log("🚀 -------------------------------------------------------------------🚀");
    console.log("🚀 -> file: PDF-Functions.js -> line 24 -> findAllPDF -> pdfs", pdfs);
    console.log("🚀 -------------------------------------------------------------------🚀");
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

// GOAL: Retrieve the forms assigned
//
//
//
//
const getAssignedPDFs = async (email) => {
    const pdfs = await findAllPDF(email, false);
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

const getPendingPDFs = async (email) => {
    const pdfs = await findAllPDF(email, false);
    let assignedPDFs = pdfs.filter(pdf => {
        console.log("🚀 ---------------------------------------------------------------------🚀");
        console.log("🚀 -> file: PDF-Functions.js -> line 67 -> getPendingPDFs -> pdf", pdf);
        console.log("🚀 ---------------------------------------------------------------------🚀");
        const originalOwner = ((pdf.fileName).split("/"))[0];
        return ((originalOwner == email)) ? true : false;
    });

    assignedPDFs = await Promise.all(assignedPDFs.map(async pdf => {
        const recipients = await getAssignedRecipients(pdf.fileName);
        return recipients;
    }));

    assignedPDFs = assignedPDFs.filter(pdf => pdf.length != 0);
    return assignedPDFs;
};

const getCompletedPDFs = async (email) => {
    const pdfs = await PDF.findAll({
        raw: true,
        where: {
            completed: {
                [Op.eq]: true,
            },
            fk_email: {
                [Op.eq]: email,
            },
        },
    });
    console.log("🚀 -------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: PDF-Functions.js -> line 86 -> getCompletedPDFs -> pdfs", pdfs);
    console.log("🚀 -------------------------------------------------------------------------🚀");
    return pdfs;
};

const markPDFAsCompleted = async (fileName, email) => {
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
};

const testFunction = ()=>console.log("hellow world");


module.exports = {addPDF, findPDF, findAllPDF,
    testFunction, getAssignedPDFs, getPendingPDFs, markPDFAsCompleted, getCompletedPDFs};
