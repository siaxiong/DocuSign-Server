const PDF = require("../Models/PDF");
const {Op} = require("sequelize");
const {getAssignedRecipients, getMySingleRecipient, isMyTurnToSign} = require("../RECIPIENT_Table/Recipient-Functions");
const Recipient = require("../Models/Recipient");

const addPDF = async (email, file, next) => {
    return await PDF.create({
        fileName: file.key,
        originalVersion: file.versionId,
        currentVersion: file.versionId,
        fk_email: email,
    }).then(response=>response).catch(err=>next(err));
};

const updatePDFVersion = async (email, newVersion, prevVersion, formName, next) => {
    await PDF.update({
        currentVersion: newVersion,
    }, {
        where: {
            currentVersion: {
                [Op.eq]: prevVersion,
            },
            fileName: {
                [Op.eq]: formName,
            },
        },
    }).catch(err=>next(err));
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
    }).then(response=>response);
};

const appendSignersToPDFs = async (pdfList, next) => {
    return await Promise.all(pdfList.map(async pdf=>{
        return Recipient.findOne({
            raw: true,
            where: {
                fk_fileName: {
                    [Op.eq]: pdf.fileName,
                },
                currentVersion: {
                    [Op.eq]: pdf.currentVersion,
                },
                fk_version: {
                    [Op.eq]: pdf.originalVersion,
                },
                signed: {
                    [Op.eq]: true,
                },
            },
        }).then(response=>{
            console.log("🚀 ------------------------------------------------------------------------------------🚀");
            console.log("🚀 -> file: PDF-Functions.js -> line 64 -> appendSignersToPDFs -> response", response);
            console.log("🚀 ------------------------------------------------------------------------------------🚀");
            pdf.signer = (response?.order !== null) ? "multiple signers" : response.email;
            return pdf;
        }).catch(err=>next(err));
    }));
};

const getAssignedPDFs = async (email, next) => {
    // Find all pdfs that belong to "email" and
    // that needs to be signed
    const pdfs = await findAllPDF(email, false);

    // Pdfs that needs to be signed are ones that "email"
    // did not upload him/herself
    let assignedPDFs = pdfs.filter(pdf => {
        const originalOwner = ((pdf.fileName).split("/"))[0];
        return originalOwner !== email ? true : false;
    });

    // Only get back pdfs that needs to be signed and is "email" turn to sign.
    // If not "email" turn to sign, they wont get the pdf yet.
    assignedPDFs = await Promise.all(assignedPDFs.map(async pdf => {
        // The very original pdf from the sender might have been modify right before
        // sending the pdf out to people so the version assigned to people is the latest
        // modified version(currentVersion) from the sender. Thus, we use currentVersion here. The originalVersion
        // in the Recipient table reflects the latest version that was modified by the sender right before they
        // receive the pdf.
        const myPDF = await getMySingleRecipient(pdf.originalVersion, pdf.fileName, email, next);
        let isMyTurn = false;
        if (myPDF) {
            isMyTurn = await isMyTurnToSign(myPDF.fk_version, myPDF.fk_fileName, email, next);
        }
        return isMyTurn ? myPDF : null;
    }));

    assignedPDFs = assignedPDFs.filter(pdf => pdf != null);
    return assignedPDFs;
};

// Get pdfs that "email" uploaded and sent to other people to sign.

const getPendingPDFs = async (email, next) => {
    const pdfs = await findAllPDF(email, false);
    // "email" has pdfs that other people sent to him/her to sign.
    // We only want pdfs that "email" sent to other people.
    // Thus, filtering out any pdfs he/she didnt upload and sent.
    let pendingPDFs = pdfs.filter(pdf => {
        const originalOwner = ((pdf.fileName).split("/"))[0];
        return ((originalOwner === email)) ? true : false;
    });

    // Find people who are assigned to sign the pdfs found above.
    pendingPDFs = await Promise.all(pendingPDFs.map(async pdf => {
        return await getAssignedRecipients(pdf.originalVersion, pdf.fileName, next);
    }));

    console.log("Pending *****");
    console.log(pendingPDFs.filter(pdf => pdf.length != 0));

    return pendingPDFs.filter(pdf => pdf.length != 0);
};

const getCompletedPDFs = async (email, next) => {
    const completedPDFs = await PDF.findAll({
        raw: true,
        where: {
            completed: {
                [Op.eq]: true,
            },
            fk_email: {
                [Op.eq]: email,
            },
        },
    }).catch(err=>next(err));

    return await appendSignersToPDFs(completedPDFs, next);

    // return await Promise.all(completedPDFs.map(pdf=>{
    //     return Recipient.findOne({
    //         raw: true,
    //         where: {
    //             fk_fileName: {
    //                 [Op.eq]: pdf.fileName,
    //             },
    //             currentVersion: {
    //                 [Op.eq]: pdf.currentVersion,
    //             },
    //             fk_version: {
    //                 [Op.eq]: pdf.originalVersion,
    //             },
    //             signed: {
    //                 [Op.eq]: true,
    //             },
    //         },
    //     }).then(response=>{
    //         pdf.signer = (response.order !== null) ? "multiple signers" : response.email;
    //         return pdf;
    //     }).catch(err=>next(err));
    // }));
};


module.exports = {addPDF, findAllPDF,
    getAssignedPDFs, getPendingPDFs, updatePDFVersion, getCompletedPDFs};
