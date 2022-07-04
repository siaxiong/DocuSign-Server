const {Sequelize, Dataypes, DataTypes} = require("sequelize")
const sequelize = require("../connection")
const User = require("./User")

const PDF = sequelize.define("PDFs", {
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true
        }
    },
    fileObj: {
        type: DataTypes.BLOB,
        allowNull: false,
        validate: {
            notEmpty: true
        }
        
    }
}, {
    tableName: "PDFs",
    timestamps: false
})


module.exports = PDF;