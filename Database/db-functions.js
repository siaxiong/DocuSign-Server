const User = require("./Models/User")
const PDF = require("./Models/PDF")
const Recipient = require("./Models/Recipient")
const Associations = require("./Models/Associations")
const sequelize = require("./connection")
const fs = require("fs")
const path = require("path")
const { Blob } = require("buffer");




const createUserTuple = async (user) => {

    try {
        let data = await User.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        })

        return data;
        
    } catch (error) {
        console.error(error);
        return error;
    }

}

const addPdfTuple = async (pdf) => {

    // let filePath = __dirname + "/samplePdf.pdf"
    let base64File = `data:application/pdf;base64,${pdf.base64}`;
    console.log(base64File);

    const buffer = Buffer.from(base64File, 'base64');
    const blob = new Blob(buffer);

    try {
        let data = await PDF.create({
            fileName: pdf.fileName,
            fileObj: blob,
            fk_email: pdf.email
            
        })

        return data;

    }catch(error){
        console.error(error)
        return error;
    }
}

const addRecipient = async () => {

    try {

        let data = await Recipient.create({
            email: "siaxiong@yahoo.com",
            fk_fileName: "testFile"
        })  

        console.log(data)
        
        return data
        
    } catch (error) {
        console.error(error)
        return error
    }
}


module.exports = {createUserTuple, addPdfTuple, addRecipient};