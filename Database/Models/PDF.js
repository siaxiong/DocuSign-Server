const {DataTypes} = require("sequelize");
const sequelize = require("../connection");

const PDF = sequelize.define("PDFS", {
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true,
        },
    },
    originalVersion: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true,
        },
    },
    currentVersion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null,
        validate: {
            notEmpty: false,
        },
    },
    fk_email: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
}, {
    tableName: "PDFS",
    timestamps: false,
});


module.exports = PDF;
