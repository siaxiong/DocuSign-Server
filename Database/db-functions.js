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
            name: "default for now",
            email: user.email
        })

        return data;
        
    } catch (error) {
        console.error(error);
        return error;
    }

}

const addPdfTuple = async () => {

    let filePath = __dirname + "/samplePdf.pdf"
    let base64File = "data:application/pdf;base64," + fs.readFileSync(filePath, 'base64')
    // console.log(base64File);

    const buffer = Buffer.from(base64File, 'base64');
    const blob = new Blob(buffer);
    console.log("blob is: " + blob)

    let obj = {

    }

    try {
        let data = await PDF.create({
            fileName: "testFile",
            fileObj: blob,
            fk_email: "siaxiong52@gmail.com"
            
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