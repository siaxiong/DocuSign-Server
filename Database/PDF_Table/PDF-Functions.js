const PDF = require("../Models/PDF");

const addPDF = async (fileName, email) => {
    PDF.create({
        fileName: fileName,
        fk_email: email,
    });
};

module.exports = {addPDF};
