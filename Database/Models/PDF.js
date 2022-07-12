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
    fileObj: {
        // eslint-disable-next-line new-cap
        type: DataTypes.BLOB("long"),
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
}, {
    tableName: "PDFs",
    timestamps: false,
});


module.exports = PDF;
