const {Sequelize, DataTypes} = require("sequelize")
const sequelize = require("../connection")
const PDF = require("./PDF")

const Recipient = sequelize.define("RECIPIENTS", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true
        }
    }
}, {
    tableName: "RECIPIENTs",
    timestamps: false
})


module.exports = Recipient
