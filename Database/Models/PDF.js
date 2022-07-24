const {DataTypes} = require("sequelize");
const sequelize = require("../connection");

const PDF = sequelize.define("PDFs", {
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
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
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true,
        },
    },
}, {
    tableName: "PDFs",
    timestamps: false,
});


module.exports = PDF;
