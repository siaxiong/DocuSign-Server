const sequelize = require("./connection");
const User = require("./Models/User");
const PDF = require("./Models/PDF")
const Recipient = require("./Models/Recipient")
const Associations = require("./Models/Associations")
const {createUserTuple, addPdfTuple, addRecipient} = require("./db-functions")



let init = async () => {
    let obj = await createUserTuple({
        name: "sia x",
        email: "siaxiong52@gmail.com"
        })
    // console.log(obj);
    

};
// addPdfTuple();
// init();

// addRecipient();
// sequelize.drop();
