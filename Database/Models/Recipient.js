const {DataTypes} = require("sequelize");
const sequelize = require("../connection");

const Recipient = sequelize.define("RECIPIENTS", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true,
        },
    },
    signed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
}, {
    tableName: "RECIPIENTs",
    timestamps: false,
});


module.exports = Recipient;
