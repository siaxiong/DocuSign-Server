const Recipient = require("../Models/Recipient");
const PDF = require("../Models/PDF");
const {s3CopyPDF} = require("../../AWS/S3/s3Functions");
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line max-len
const {Op} = require("sequelize");

// Checks if the form processing is in a workflow where it needs to be signed in
// sequential order.
const isInOrder = async (fileVersion, next) => {
    return Recipient.findOne({
        raw: true,
        where: {
            currentVersion: {
                [Op.eq]: fileVersion,
            },
        },
    }).then(response=>{
        return response?.order ? true : false;
    }).catch(err=>next(err));
};

const addRecipients = async (emailList, ownerEmail, client, fileName, newVersion, originalVersion, order=true, next) => {
    for (const index in emailList) {
        let newFileCopy;
        if (!order) {
            newFileCopy = await s3CopyPDF(client, ownerEmail, fileName, newVersion);
        }
        const realIndex = parseInt(index) + 1;

        // Create tuples for this current user in the for loop.

        if (!order) {
            // Create a copy for the SENDER
            await PDF.create({
                fileName,
                originalVersion: newFileCopy.VersionId,
                currentVersion: newFileCopy.VersionId,
                fk_email: fileName.substring(0, fileName.indexOf("/")),
                completed: false,
            }).catch(err=>next(err));
        }
        // Purpose is for tracking signing progress
        await Recipient.create({
            email: emailList[index],
            order: order ? realIndex : null,
            reject: false,
            signed: false,
            currentVersion: order ? newVersion : newFileCopy.VersionId,
            fk_fileName: fileName,
            fk_version: order ? originalVersion : newFileCopy.VersionId,
        }).catch(err=>next(err));

        // Create a copy for SIGNER
        await PDF.create({
            fileName,
            originalVersion: order ? originalVersion : newFileCopy.VersionId,
            currentVersion: order ? newVersion : newFileCopy.VersionId,
            fk_email: emailList[index],
            completed: false,
        }).catch(err=>next(err));
    };

    if (!order) {
        await PDF.destroy({
            where: {
                fileName: {
                    [Op.eq]: fileName,
                },
                fk_email: {
                    [Op.eq]: fileName.substring(0, fileName.indexOf("/")),
                },
                currentVersion: {
                    [Op.eq]: newVersion,
                },
            },
        });
    }

    // Update the sender's file currentVersion to false for the completed attribute
    await PDF.update({completed: false}, {where: {fileName: {[Op.eq]: fileName}, fk_email: {[Op.eq]: ownerEmail}, currentVersion: {[Op.eq]: newVersion}}}).catch(err=>next(err));
};


const getAssignedRecipients = async (originalVersion, fileName, next) => {
    return await Recipient.findAll({
        raw: true,
        where: {
            fk_version: {
                [Op.eq]: originalVersion,
            },
            fk_fileName: {
                [Op.eq]: fileName,
            },
        },
    }).then(response=>{
        if (response.length === 1) return response[0];
        else return response;
    }).catch(err=>next(err));
};

const findAllRecipient = async (originalVersion, fileName, next) => {
    return await Recipient.findAll({
        raw: true,
        where: {
            fk_fileName: {
                [Op.eq]: fileName,
            },
            fk_version: {
                [Op.eq]: originalVersion,
            },
        },
    }).then(response=>response).catch(err=>next(err));
};
const isMyTurnToSign = async (originalVersion, fileName, myEmail, next) => {
    const recipients = await findAllRecipient(originalVersion, fileName, next);
    if (recipients[0].order === null) return true;
    if (!recipients.length) return false;
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

const getMySingleRecipient = async (currentVersion, fileName, myEmail, next) => {
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
            fk_version: {
                [Op.eq]: currentVersion,
            },
        },
    }).then(response=>response).catch(err=>next(err));
};

const markAsSignedInOrder = async (newVersion, email, currentVersion, fileName, next) => {
    const response = await Recipient.update({
        signed: true,
        currentVersion: newVersion,
    },
    {where: {
        email: {
            [Op.eq]: email,
        },
        fk_fileName: {
            [Op.eq]: fileName,
        },
        currentVersion: {
            [Op.eq]: currentVersion,
        },
    },
    }).catch(err=>next(err));

    // Update the current user's copy in the PDF table to completed
    await PDF.update({
        currentVersion: newVersion,
        completed: true,
    },
    {where: {
        fk_email: {
            [Op.eq]: email,
        },
        currentVersion: {
            [Op.eq]: currentVersion,
        },
        fileName: {
            [Op.eq]: fileName,
        },
        completed: {
            [Op.eq]: false,
        },
    },
    }).then(response=>console.log(response)).catch(err=>next(err));

    // Update all other signer's version to the current version
    // only applies to forms that needs to be signed in order
    await PDF.update({
        currentVersion: newVersion,
    }, {
        where: {
            currentVersion: {
                [Op.eq]: currentVersion,
            },
            fileName: {
                [Op.eq]: fileName,
            },
            completed: {
                [Op.eq]: false,
            },
        }}).catch(err=>next(err));

    // Same idea as the above operation but in the Recipient table
    await Recipient.update({
        currentVersion: newVersion,
    }, {
        where: {
            currentVersion: {
                [Op.eq]: currentVersion,
            },
            signed: {
                [Op.eq]: false,
            },
            fk_fileName: {
                [Op.eq]: fileName,
            },
        },
    });


    const resp = await Recipient.findAll({
        raw: true,
        where: {
            fk_fileName: {
                [Op.eq]: fileName,
            },
            signed: {
                [Op.eq]: false,
            },
            currentVersion: {
                [Op.eq]: newVersion,
            },
            order: {
                [Op.ne]: null,
            },
        },
    }).catch(err=>next(err));

    (resp.length === 0) ? await PDF.update({completed: true},
        {where: {fileName: {[Op.eq]: fileName}, currentVersion: {[Op.eq]: newVersion}, fk_email: {
            [Op.eq]: fileName.substring(0, fileName.indexOf("/"))}}}).catch(err=>next(err)): null;

    return response;
};

const markAsSignedUnOrder = async (newVersion, email, currentVersion, fileName, next) => {
    // Update the SIGNER's tuple in the Recipient table
    await Recipient.update({
        signed: true,
        currentVersion: newVersion,
    },
    {where: {
        email: {
            [Op.eq]: email,
        },
        fk_fileName: {
            [Op.eq]: fileName,
        },
        currentVersion: {
            [Op.eq]: currentVersion,
        },
    },
    }).catch(err=>next(err));

    // Update both the SIGNER's and SENDER's tuple in the PDF table
    // They each have the exact copy because each one owns a copy (for unorder signing).
    await PDF.update({
        completed: true,
        currentVersion: newVersion,
    },
    {where: {
        currentVersion: {
            [Op.eq]: currentVersion,
        },
        originalVersion: {
            [Op.eq]: currentVersion,
        },
        fileName: {
            [Op.eq]: fileName,
        },
    },
    }).then(response=>console.log(response)).catch(err=>next(err));
};

module.exports = {isInOrder, addRecipients, isMyTurnToSign, getAssignedRecipients, markAsSignedInOrder, markAsSignedUnOrder, getMySingleRecipient};
