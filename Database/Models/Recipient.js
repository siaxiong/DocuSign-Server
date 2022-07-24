const {DataTypes} = require("sequelize");
const sequelize = require("../connection");

const Recipient = sequelize.define("RECIPIENTS", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    reject: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
    fk_fileName: {
        type: DataTypes.STRING,
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
