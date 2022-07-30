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

const addRecipients = async (emailList, ownerEmail, client, formName, newVersion, originalVersion, order=true, next) => {
    for (const index in emailList) {
        let newFileCopy;
        if (!order) {
            newFileCopy = await s3CopyPDF(client, ownerEmail, formName, newVersion);
        }
        const realIndex = parseInt(index) + 1;
        console.log("🚀 --------------------------------------------------------------------------------------🚀");
        console.log("🚀 -> file: Recipient-Functions.js -> line 13 -> addRecipients -> realIndex", typeof(realIndex));
        console.log("🚀 --------------------------------------------------------------------------------------🚀");
        await Recipient.create({
            email: emailList[index],
            order: order ? realIndex : null,
            reject: false,
            signed: false,
            currentVersion: order ? newVersion : newFileCopy.VersionId,
            fk_fileName: formName,
            fk_version: originalVersion,
        }).catch(err=>next(err));
        await PDF.create({
            fileName: formName,
            originalVersion: originalVersion,
            currentVersion: order ? newVersion : newFileCopy.VersionId,
            fk_email: emailList[index],
            completed: false,
        }).catch(err=>next(err));
    };

    // Update the sender's file currentVersion to false for the completed attribute
    await PDF.update({completed: false}, {where: {fileName: {[Op.eq]: formName}, fk_email: {[Op.eq]: ownerEmail}, currentVersion: {[Op.eq]: newVersion}}}).catch(err=>next(err));
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
    }).then(response=>response).catch(err=>next(err));
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
            currentVersion: {
                [Op.eq]: currentVersion,
            },
        },
    }).then(response=>response).catch(err=>next(err));
};

const markAsSigned = async (newVersion, email, prevVersion, formName, next) => {
    const response = await Recipient.update({
        signed: true,
        currentVersion: newVersion},
    {where: {
        email: {
            [Op.eq]: email,
        },
        fk_fileName: {
            [Op.eq]: formName,
        },
        currentVersion: {
            [Op.eq]: prevVersion,
        },
    },
    }).catch(err=>next(err));

    // await PDF.update({
    //     currentVersion: newVersion,
    //     completed: true,
    // },
    // {where: {
    //     fk_email: {
    //         [Op.eq]: email,
    //     },
    //     currentVersion: {
    //         [Op.eq]: prevVersion,
    //     },
    //     fileName: {
    //         [Op.eq]: formName,
    //     },
    // },
    // }).then(response=>console.log(response)).catch(err=>next(err));
    await PDF.update({
        completed: true,
    },
    {where: {
        fk_email: {
            [Op.eq]: email,
        },
        currentVersion: {
            [Op.eq]: newVersion,
        },
        fileName: {
            [Op.eq]: formName,
        },
    },
    }).then(response=>console.log(response)).catch(err=>next(err));


    const resp = await Recipient.findAll({
        raw: true,
        where: {
            fk_fileName: {
                [Op.eq]: formName,
            },
            signed: {
                [Op.eq]: false,
            },
            currentVersion: {
                [Op.eq]: prevVersion,
            },
            order: {
                [Op.ne]: null,
            },
        },
    }).catch(err=>next(err));

    await Recipient.update({
        currentVersion: newVersion,
    }, {
        where: {
            currentVersion: {
                [Op.eq]: prevVersion,
            },
            signed: {
                [Op.eq]: false,
            },
        },
    });

    await Promise.all(resp.map(async recipient=>{
        await Recipient.update({
            currentVersion: newVersion,
        }, {
            where: {
                currentVersion: {
                    [Op.eq]: prevVersion,
                },
                email: {
                    [Op.eq]: recipient.email,
                },
            },
        });
        return recipient;
    }));

    await PDF.update({
        currentVersion: newVersion,
    }, {
        where: {
            currentVersion: {
                [Op.eq]: prevVersion,
            },
            completed: {
                [Op.eq]: false,
            },
        },
    });


    console.log("🚀 ----------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: Recipient-Functions.js -> line 149 -> markAsSigned -> resp", resp);
    console.log("🚀 ----------------------------------------------------------------------------🚀");

    (resp.length === 0) ? await PDF.update({completed: true},
        {where: {fileName: {[Op.eq]: formName}, currentVersion: {[Op.eq]: newVersion}, fk_email: {
            [Op.eq]: formName.substring(0, formName.indexOf("/"))}}}).catch(err=>next(err)): null;

    const originalOwnerVersion = await Recipient.findOne({
        raw: true,
        where: {
            currentVersion: {
                [Op.eq]: newVersion,
            },
            fk_fileName: {
                [Op.eq]: formName,
            },
            email: {
                [Op.eq]: email,
            },
        },
    });
    console.log("🚀 ------------------------------------------------------------------------------------------------------------🚀");
    console.log("🚀 -> file: Recipient-Functions.js -> line 234 -> markAsSigned -> originalOwnerVersion", originalOwnerVersion);
    console.log("🚀 ------------------------------------------------------------------------------------------------------------🚀");

    (resp.length === 0) ? await PDF.update({completed: true},
        {where: {fileName: {[Op.eq]: formName}, originalVersion: {[Op.eq]: originalOwnerVersion.fk_version}, fk_email: {
            [Op.eq]: formName.substring(0, formName.indexOf("/"))}}}).catch(err=>next(err)): null;


    return response;
};

const markAsSignedUnOrder = async (newVersion, email, prevVersion, formName, next) => {

};

module.exports = {isInOrder, addRecipients, isMyTurnToSign, getAssignedRecipients, markAsSigned, markAsSignedUnOrder, getMySingleRecipient};
