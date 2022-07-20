const PDF = require("../../../Database/Models/PDF");

/**
 * It returns all the PDFs that belong to a user
 * @param userEmail - The email of the user who is logged in.
 * @returns An array of objects.
 */
const getAllPDFs = async (userEmail) =>{
    const PDFs = await PDF.findAll({
        raw: true,
        where: {
            fk_email: userEmail,
        },
    });
    console.log(PDFs);
    return PDFs;
};

module.exports = {getAllPDFs};
